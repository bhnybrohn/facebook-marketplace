import express from "express";
const app = express();

import morgan from "morgan";
import Job from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";

import { faceBookGraphSale, sendSaleMail } from "./jobs/sale.js";
import { faceBookGraphRent, sendRentMail } from "./jobs/rent.js";

app.use(morgan("dev"));

app.get("/", (req, res) => {

  res.status(202).send("Job running at some port");

});


Job.schedule("*/1 * * * *", async () => {
  
  //data from facebook queries
  const SaleData = await faceBookGraphSale();
  const RentData = await faceBookGraphRent();
 
  // console.log(SaleData, RentData) 

  //present time and date
  const time = new Date();
  //remove five minutes from the present timey
  const formaltime = time.setMinutes(time.getMinutes() - 1);

  //convert tot RSO format
  const start = Date.parse(time);
  const end = Date.parse(formaltime);

  //map through listings
  SaleData.map((list) => {
    const listingDate = Date.parse(list.date);
    if (listingDate > start && listingDate < end) {
      console.log('Found Sales')
      sendSaleMail(list);
    }
  });

  //map through listings
  RentData.map((list) => {
    const listingDate = Date.parse(list.date);
    if (listingDate > start && listingDate < end) {
      console.log('Found Rent')
      sendRentMail(list);
    }
  });
});

const port = process.env.ENV || 3000;
app.listen(port, () => {
  console.log("Job running 3000!");
});
