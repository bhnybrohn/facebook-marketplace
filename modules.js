import fetch from "node-fetch";
import nodemailer from "nodemailer";

const faceBookGraph = async () => {
  try {
    const response = await fetch("https://www.facebook.com/api/graphql/", {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: "av=0&__user=0&__a=1&__dyn=7xeUmBwjbgmwCwRyWzEsheC1swgE98nwgU6C4UKewSAAwCxW4E2czobohxi2i3qcw9m7oqx61BwvU2Vwb-q3q5Voy6o2xwbG783pwKx-8wlU-cBweq0wXAy85iaxq3m7Eaoy15wJwBgK4oK227Ua831wLwKwFxe0H8-7Eox21uwjojxm&__csr=&__req=l&__beoa=0&__pc=PHASED%3ADEFAULT&dpr=2&__rev=1001662448&__s=aw8z00%3Asobw97%3Az0y5t9&__hsi=6788100950301358546-0&lsd=AVqtNhkO&jazoest=2748&__spin_r=1001662448&__spin_b=trunk&__spin_t=1580477913&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=MarketplaceNewSearchFeedPaginationQuery&variables=%7B%22count%22%3A16%2C%22cursor%22%3A%22%7B%5C%22pg%5C%22%3A0%2C%5C%22b2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22%5C%22%2C%5C%22it%5C%22%3A0%2C%5C%22hmsr%5C%22%3Afalse%2C%5C%22tbi%5C%22%3A0%7D%2C%5C%22c2c%5C%22%3A%7B%5C%22br%5C%22%3A%5C%22AboZViCziur4EpVnWRWwdavBcJPPWqTrfg8iD56vK04vkKWAiDcN8b1XuNuthTcfJNzbH1Y3KMGJjO6LO2JBJaVKm3FHtbYsXLh3ch8Q2JY36VQTJVVARYuTq-ZPYiBEZ3EI3zcPM9iYvrWkDU-JjYqv6Y8DN7gRdBsBWFF8lVZngfNzx5sEofhN99gWRf1T9pIiIb35TyqF3PpKrNlgRwNIOtxgss2rm-WNqED5B6SGuHIasYrPkaLwtbcwC5NRGRMHT88aGhq-7mIpzoyBQhF2OPqjeZ-wH18TbW1Jz5byh-CzqUSMKRVb3X-M1jnlHNK_m75oWn9kRbeSGBlUEfTlAlK7i6MXfv3E8Nn_Hf5kEcRL7TyVyYLagFk8Q5OClYwj6gXEKWsE9lirRGHTQvUT%5C%22%2C%5C%22it%5C%22%3A8%2C%5C%22rpbr%5C%22%3A%5C%22%5C%22%2C%5C%22rphr%5C%22%3Afalse%7D%2C%5C%22irr%5C%22%3Afalse%7D%22%2C%22MARKETPLACE_FEED_ITEM_IMAGE_WIDTH%22%3A196%2C%22VERTICALS_LEAD_GEN_PHOTO_HEIGHT_WIDTH%22%3A40%2C%22MERCHANT_LOGO_SCALE%22%3Anull%2C%22params%22%3A%7B%22bqf%22%3A%7B%22callsite%22%3A%22COMMERCE_MKTPLACE_WWW%22%2C%22query%22%3A%22orlando%20apartments%20for%20rent%22%7D%2C%22browse_request_params%22%3A%7B%22filter_location_id%22%3A%22108288992526695%22%2C%22commerce_search_sort_by%22%3A%22BEST_MATCH%22%2C%22filter_price_lower_bound%22%3A0%2C%22filter_price_upper_bound%22%3A214748364700%7D%2C%22custom_request_params%22%3A%7B%22surface%22%3A%22SEARCH%22%2C%22search_vertical%22%3A%22C2C%22%7D%7D%7D&doc_id=2846705378683003",
      method: "POST",
    });
    const { data } = await response.json();

    const mappedData = data.marketplace_search.feed_units.edges.map((data) => {
      let info = {
        listing_title: data.node.listing.marketplace_listing_title,
        sold: data.node.listing.is_live,
        pending: data.node.listing.is_pending,
        sold: data.node.listing.is_sold,
        image_1: data.node.listing.primary_listing_photo,
        location: data.node.listing.location,
        listing_url: data.node.listing.share_uri,
        seller: data.node.listing.marketplace_listing_seller,
        agent: data.node.listing.real_estate_listing_agent,
        listed_by: data.node.listing.listed_by,
        price: data.node.listing.formatted_price,
        date: new Date(
          data.node.listing.creation_time * 1000
        ).toLocaleDateString(),
      };
      return info;
    });
    return mappedData;
  } catch (error) {
    console.log("Error happened", error);
    return error;
  }
};

const sendMail = async (data) => {
  const transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    auth: {
      user: "AKIAUOJ5TESKEANANFLC", // generated ethereal user
      pass: "BNMYViLooVcvpIULvFobeZ4pKTb+K12F/6LErD2+EXum", // generated ethereal password
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const message = {
    from: `${"Listings Alert"} <admin@lokhator.com>`,
    to: "smyxbrone@gmail.com",
    subject: "Orlando Listings",
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
export { faceBookGraph, sendMail };
