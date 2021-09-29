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

Job.schedule("0 */5 * * * *", async () => {
  //data from facebook queries
  const SaleData = await faceBookGraphSale();
  const RentData = await faceBookGraphRent();
  console.log("Job Ran")
  //present time and date

  const time = new Date();
  //remove five minutes from the present ytimey
  // const formaltime = time.setMinutes(time.getMinutes() - 300);

  //convert tot RSO format
  const start = Date.parse(time);
  let diffMinutes = 60000 * 5;

  let runFunction = false;


// function helloOnce() {
//   if (!saidHello) sayHello();
// }
  //map through listings

  SaleData.flat().forEach((list) => {
    const listingDate = Date.parse(list.date);
    // runFunction = true
    if (start - listingDate <= diffMinutes) {
      console.log("Found Sales");
      sendSaleMail(list);
    }
  });


  //map through listings
  RentData.flat().forEach((list) => {
    const listingDate = Date.parse(list.date);
    // console.log("date: ", listingDate, formaltime, start);
    if (start - listingDate <= diffMinutes) {
      console.log("Found Rent");
      sendRentMail(list);
    }
  });
});

app.listen(process.env.PORT || 8080, () => {
  console.log("Job running 3000!");
});
