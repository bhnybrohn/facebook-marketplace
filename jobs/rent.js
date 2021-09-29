import nodemailer from "nodemailer";
import { google } from "googleapis";
import axios from "axios";
import { config } from "../queries.js";

import dotenv from "dotenv";
dotenv.config();

const faceBookGraphRent = async () => {
 let returnData = []
  await axios
    .all([
      axios(config.url, {
        headers: config.headers,
        data: config.house_for_rent,
        method: "post",
      }),
      axios(config.url, {
        headers: config.headers,
        data: config.apartment_for_rent,
        method: "post",
      }),
    ])
    .then(
      axios.spread((data1, data2) => {
        const data = [
          // ...data1.data.data?.marketplace_search?.feed_units?.edges,
          // ...data2.data.data?.marketplace_search?.feed_units?.edges,
        ];
        if (
          data1?.data?.data?.marketplace_search?.feed_units?.edges !==
          undefined
        ) {
          // console.log(
          // data1.data?.data?.marketplace_search?.feed_units?.edges,
          // )
          data.push(
            ...data1.data?.data?.marketplace_search?.feed_units?.edges
          );
        }
        if (
          data2?.data?.data?.marketplace_search?.feed_units?.edges !==
          undefined
        ) {
          // console.log(
          // data2.data?.data?.marketplace_search?.feed_units?.edges,
          // )
          data.push(
            ...data2.data?.data?.marketplace_search?.feed_units?.edges
          );
        }
        const mappedData = data.map((data) => {
          let info = {
            listing_title: data?.node?.listing?.marketplace_listing_title,
            sold: data?.node?.listing?.is_live,
            pending: data?.node?.listing?.is_pending,
            sold: data?.node?.listing?.is_sold,
            image_1: data?.node?.listing?.primary_listing_photo,
            location: data?.node?.listing?.location,
            listing_url: data?.node?.listing?.share_uri,
            seller: data?.node?.listing?.marketplace_listing_seller,
            agent: data?.node?.listing?.real_estate_listing_agent,
            listed_by: data?.node?.listing?.listed_by,
            price: data?.node?.listing?.formatted_price,
            date: new Date(
              data?.node?.listing?.creation_time * 1000
            ).toISOString(),
          };
          return info;
        });
         returnData.push(mappedData)
        // return mappedData;
      })
    )
    .catch((error) => console.error(error.message));
  return returnData;
};

const sendRentMail = async (data) => {

  let transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'info@talos.africa', // generated ethereal user
        pass: 'Talosinfo@2020', // generated ethereal password
    },
    tls: {
        rejectUnauthorized: false,
    },
});
  const message = {
    from: `${"FB Marketplace Lead"} <hello@figopayment.com>`,
    to: [ "Leia@SellMyHouseFastOrlandoFl.com" ,"smyxbrone@gmail.com", "rajiorazaq@gmail.com"],
    subject: "FB Marketplace lead",
    html: `<!DOCTYPE html>	
    <html lang="en">
    <body style="padding-left: 15px;padding-right: 15px;padding-bottom: 26px; padding-top:20px; font-family: sans-serif;">
    <div class="body" style="margin: 0 10%;">
      <div class="icon">
      <h3 style="margin: 20px 0;font-style: 14;font-weight: 500;font-size: 14px;line-height: 18px;color: #333;"><span style="color: #12326B;">
     New Orlando Listings </h3>
     <a href="www.talos.africa"><img src=${
       data.image_1.lead_gen_preview_image
     } width="250px" height="auto" class="img" style="display: inline-block;"></a>
    <a href="www.talos.africa"><img src=${
      data.image_1.image.uri
    } width="250px" height="auto" class="img" style="display: inline-block;"></a>
    </div>
    <p style="margin: 20px 0;font-style: 14;font-weight: 500;font-size: 14px;line-height: 18px;color: #333;">Title: ${
      data.listing_title
    }</p>
    <p style="margin: 20px 0;font-style: 14;font-weight: 500;font-size: 14px;line-height: 18px;color: #333;"> sold:  ${
      data.sold
    }</p>
            <p style="margin: 20px 0;font-style: 14;font-weight: 500;font-size: 14px;line-height: 18px;color: #333;"> pending:  ${
              data.pending
            }</p>
    <p style="margin: 20px 0;font-style: 14;font-weight: 500;font-size:
     14px;line-height: 18px;color: #333;">price :${data.price.text} </p>
    <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
    500;font-size: 14px;line-height: 18px;">
          seller : ${data.seller.name}  
            </p>
            <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
            500;font-size: 14px;line-height: 18px;">
                  agent : ${data.agent}  
                    </p>
                     <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
    500;font-size: 14px;line-height: 18px;">
          listed_by : ${data.listing_by}  
            </p>
            <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
            500;font-size: 14px;line-height: 18px;">
                  date : ${data.date}  
                    </p>
                    <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
                    500;font-size: 14px;line-height: 18px;">
                          Location : ${
                            (data.location.reverse_geocode_detailed.city,
                            data.location.reverse_geocode_detailed.state)
                          }  </br>
                          Postal: ${
                            data.location.reverse_geocode_detailed.postal_code
                          }
                            </p>
                    <p class="text_color" style="color: #12326B;margin: 20px 0;font-style: 14;font-weight: 
                    500;font-size: 14px;line-height: 18px;">
                          url: ${data.listing_url}  
                            </p>

      
    </body>
    </html>`,
  };

  try {
    const send = await transporter.sendMail(message);
    if (send) console.log("sent");
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export { faceBookGraphRent, sendRentMail };
