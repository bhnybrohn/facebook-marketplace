import express from "express";
const app = express();

import morgan from "morgan";
import Job from "node-cron";
import dotenv from "dotenv";
dotenv.config();

import { faceBookGraphSale, sendSaleMail } from "./jobs/sale.js";
import { faceBookGraphRent, sendRentMail } from "./jobs/rent.js";

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(202).send("Job running at some port");
});

Job.schedule("*/30 * * * * *", ()=>{
  console.log("Job is Running");
})

Job.schedule("*/30 * * * *", async () => {
  //data from facebook queries
  const SaleData = await faceBookGraphSale();
  const RentData = await faceBookGraphRent();
  // console.log(SaleData.flat())
  //present time and date
  const time = new Date();
  //remove five minutes from the present ytimey
  // const formaltime = time.setMinutes(time.getMinutes() - 300);

  //convert tot RSO format
  const start = Date.parse(time);
  let diffMinutes = 60000 * 30;

  //map through listings
  SaleData.flat().forEach((list) => {
    const listingDate = Date.parse(list.date);
    // console.log(start - listingDate)
    // console.log("date: ", listingDate, formaltime, start);
    if (start - listingDate <= diffMinutes) {
      console.log("Found Sales");
      sendSaleMail(list);
    }
  });

  //map through listings
  RentData.flat().forEach((list) => {
    const listingDate = Date.parse(list.date);
    if (start - listingDate <= diffMinutes) {
      console.log("Found Rent");
      sendRentMail(list);
    }
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Job running 3000!");
});
