import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", // Set the origin of your client
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

/*require("dotenv").config();

// Create a OpenAI connection
const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});*/


app.post('/api/register/', (req, res) => {

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(req.body.password , salt);  
  const email=req.body.email;
  const name=req.body.name;

   //check if user exsist
   const q= "SELECT * FROM users WHERE email = ?"
 
   db.query(q,[email], (err,data)=>{
    if(err) return res.status(500).json(err) //problem reaching the db
    if(data.length) return res.status(409).json("User already exsist!") //if user exsist
 
 
try {
    /*const user = "shelly"
    const assistant = await openai.beta.assistants.create({
      name: `${user}`,
      //instructions: instruction,
      tools: [{ type: "code_interpreter" }],
      model: "gpt-3.5-turbo",
    });*/

    // Insert user into the database with the assistant ID
    /*await connectionDb.query(
        "INSERT INTO users (email, password,name, id) VALUES (?, ?, ?, ?)",
        [email,password,name, assistant.id]
    );*/

    db.query(
      "INSERT INTO users (email, password,username) VALUES (?, ?, ?)",
      [email,password,name]
  );

    console.log("Registration succeeded");
    res.json({ message: "success" });
} catch (err) {
    console.error(err);
    res.json({ message: "error", error: err });
}
})});


app.post('/api/translate/', async (req, res) => {
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
  
    try {
      const response = await axios.request(options);
      const translation = response.data[0].translations[0].text; // Extract the translation text
  
      console.log(translation);
      res.json({ translation }); // Send the translation as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' }); // Handle errors and send an appropriate response
    }
  });
  


app.post('/api/login/', (req, res) => {

    try {
         db.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, data) =>{

          if (data.length > 0) {
            const user = data[0];

            const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
            if (!checkPassword) return res.status(400).json("Wrong password or username");

            console.log("Login succeeded");
            //res.json({ message: "success", name: user.name });
            console.log(user.id);
            const token = jwt.sign({ id: data[0].id }, "secretkey");
            const { password, ...others } = data[0];
        
            res.cookie("accessToken", token, { httpOnly: false }).status(200).json(others);
            //const thread = await openai.beta.threads.create();
            // let run = await openai.beta.threads.runs.create(thread.id, {
            //     assistant_id: user.id,
            //     instructions: `you are an math teacher that only ask questions. ask now!`,
            //   });

            // module.exports = {
            //     openai,
            //     userId: user.id,
            //     thread,
            //     run
            //   };
           // botAssisten(user.id,thread)
            }
        else {
            console.log("Username not found");
            res.json({ message: "failed", reason: "Username not found" });
        }

        });
    } catch (err) {
        console.error(err);
        res.json({ message: "error", error: err });
    }
});

app.listen(8800,() =>{
  console.log("connected")
});


/*
function botAssisten(assistant,thread)
{
    
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  let answer="";
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  async function askQuestion(question) {
    return new Promise((resolve, reject) => {
      readline.question(question, (answer) => {
        resolve(answer);
      });
    });
  }
  
  let incorrect_answers =0;
  let questions_counter =0;
  let run;
  async function main() {
    try {

      let keepAsking = true;
      while (keepAsking) {
        questions_counter++;

        run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant,
            instructions:`you are an math teacher with English level A1 i want you to start asking the user only math question. ask now a math question!` ,
        });

        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
  
        // Polling mechanism to see if runStatus is completed
        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }
  
        // Get the last assistant message from the messages array
        let messages = await openai.beta.threads.messages.list(thread.id);
  
        // Find the last message for the current run
        let lastMessageForRun = messages.data
          .filter(
            (message) => message.run_id === run.id && message.role === "assistant"
          )
          .pop();
  
        // If an assistant message is found, console.log() it
        if (lastMessageForRun) {
          console.log(`${lastMessageForRun.content[0].text.value} \n`);
        }
  
        // Ask the user to answer the math question
        let userAnswer = await askQuestion("\nWhat is your answer? ");
  
        // Pass in the user answer into the existing thread
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: userAnswer,
        });

        
  
        //check the answer
        // Use runs to wait for the assistant response and then retrieve it
        let instruction1 = `tell me if ${userAnswer} correct or incorrect?`
  
        run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: assistant,
          instructions: instruction1,
        });
        

  
        runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
  
       // 
        // Polling mechanism to see if runStatus is completed
        // Polling mechanism to see if runStatus is completed
        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }
       // console.log(the answer?);
  
      
        // Get the last assistant message from the messages array
        messages = await openai.beta.threads.messages.list(thread.id);
  
        // Find the last message for the current run
        lastMessageForRun =await messages.data
          .filter(
            (message) => message.run_id === run.id && message.role === "assistant"
          )
          .pop();
        // If an assistant message is found, console.log() it
        if (lastMessageForRun) {
         await console.log(`${lastMessageForRun.content[0].text.value} \n`);
          answer=lastMessageForRun.content[0].text.value;
        }
  
        if (answer.includes("incorrect")) {
          incorrect_answers++;
      }
        //retrive the check 
  ///////////////////////////////////
        // Then ask if the user wants to answer another question and update keepAsking state
        const continueAnswering = await askQuestion(
          "Do you want to answer another question? (yes/no) "
        );
        keepAsking = continueAnswering.toLowerCase() === "yes";
  
        // If the keepAsking state is falsy show an ending message
        if (!keepAsking) {
          console.log("Alrighty then, I hope you enjoyed answering the questions!\n");
        }
      }
  
      // close the readline
      readline.close();
    } catch (error) {
      console.error(error);
    }
  }
  
  // Call the main function
  main();
}*/
