import bcrypt from "bcryptjs";
import { db } from "./connect.js";

import OpenAI from "openai";
const dotenv = await import('dotenv');
dotenv.config();

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});


export const registerUser = async (req, res) => {

const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync(req.body.password , salt);  
const email=req.body.email;
const username=req.body.name;

 //check if user exsist
 const q= "SELECT * FROM users WHERE email = ?"

 db.query(q,[email], async (err,data)=>{
  if(err) return res.status(500).json(err) //problem reaching the db
  if(data.length) return res.status(409).json("User already exsist!") //if user exsist

  

try {

    const assistant = await openai.beta.assistants.create({
        name: `${username}`,
        //instructions: instruction,
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo",
        });

  db.query(
    "INSERT INTO users (email, password,username, id) VALUES (?, ?, ?, ?)",
    [email,password,username, assistant.id]
);

    console.log("Registration succeeded");
    res.json({ message: "success" });

   
 //crate translate table
            

} catch (err) {
  console.error(err);
  res.json({ message: "error", error: err });
}
})

}