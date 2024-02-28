 import { db } from "./connect.js";
 import axios from "axios";


 export const translateUser = async (req, res) => {

        const options = {
          method: 'POST',
          url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
          params: {
            'to[0]': req.body.lang,
            'api-version': '3.0',
            profanityAction: 'NoAction',
            textType: 'plain'
          },
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '075247818fmshafb071848ec291cp101e1fjsne9596a653981',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
          },
          data: [
            {
              Text: req.body.text,
            }
          ]
        };
        console.log("in the back");
        try {
          const response = await axios.request(options);
          const translation = response.data[0].translations[0].text; // Extract the translation text
      
          console.log(translation);
          res.json({ translation }); // Send the translation as JSON response
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send an appropriate response
        }
      
      
 }