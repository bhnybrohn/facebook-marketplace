import express from "express";
const app = express();

import morgan from "morgan";
import Job from "node-cron";
import axios from "axios";

import { faceBookGraph, sendMail } from "./modules.js";

app.use(morgan("dev"));



Job.schedule("*/5 * * * *", async () => {
  //data from facebook queries
  const data = await faceBookGraph();

  //present time and date
  const time = new Date();
  //remove five minutes from the present timey
  const formaltime = time.setMinutes(time.getMinutes() - 5);

  //convert tot RSO format
  const start = Date.parse(time);
  const end = Date.parse(formaltime);

  //map through listings
  data.map((list) => {
    const listingDate = Date.parse(list.date);
    if (listingDate > start && listingDate < end) {
      sendMail(list);
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log("Job running 3000!");
});
