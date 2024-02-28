import bcrypt from "bcryptjs";
import { db } from "./connect.js";
import jwt from "jsonwebtoken";


//openai
import { createInterface } from 'readline';
import OpenAI from "openai";
const dotenv = await import('dotenv');
dotenv.config();

const secretKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: secretKey,
});
// 


export const loginUser = async (req, res) => {

    try {
         db.query("SELECT * FROM users WHERE email = ?", [req.body.email], async (err, data) =>{

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


           


            const thread = await openai.beta.threads.create();
        //     let run = await openai.beta.threads.runs.create(thread.id, {
        //         assistant_id: user.id,
        //         instructions: `you are an math teacher that only ask questions. ask now!`,
        //       });

        //     module.exports = {
        //         openai,
        //         userId: user.id,
        //         thread,
        //         run
        //       };
        const topic="astronomy"
        //level="easy"
        botAssisten(user.id,thread,topic,user.level)
            }
        else {
            return res.status(409).json("User not found!");
        }

        });
    } catch (err) {
        console.error(err);
        res.json({ message: "error", error: err });
    }

    
}

async function botAssisten(assistant,thread,topic,level)
{

  if(level=='A1'||level=='A2')
    level='easy'
  if(level=='B1'||level=='B2')
    level='intermediate'
  if(level=='C1'||level=='C2')
    level='difficult'
  
  console.log(level); 
    


  const readline = createInterface({
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
            instructions:`you are an ${topic} teacher. i want you to start asking the user only knowledge question about the ${topic}. ask now a knowledge question about the ${topic} and 
            making sure your question use vocabulary at ${level} level and also don't ask question that don't have one clear answer!` ,
         
        });
       
        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        // Polling mechanism to see if runStatus is completed
        while (runStatus.status !== "completed") {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
          console.log(runStatus.status); 
          
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
       // let instruction1 = tell me if my answer: ${userAnswer} correct or incorrect !
        let instruction1 = `write if the answer : ${userAnswer} is correct or incorrect! and write the correct answer!`
  
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
  
 
    } catch (error) {
        readline.close();
      console.error(error);
    }
  }
  
  // Call the main function
  main();
}
