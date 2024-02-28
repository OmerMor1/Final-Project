import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { db } from "./connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import axios from "axios";
import { createPool } from 'mysql2/promise';
import { registerUser } from "./register.js";
import { loginUser } from "./login.js";
import { translateUser } from "./translate.js";
const app = express();

app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));

app.post('/api/register', registerUser);
app.post('/api/login', loginUser);
app.post('/api/translate/', translateUser);

// /*
// app.post('/api/register/', (req, res) => {

//   const salt = bcrypt.genSaltSync(10);
//   const password = bcrypt.hashSync(req.body.password , salt);  
//   const email=req.body.email;
//   const username=req.body.name;

//    //check if user exsist
//    const q= "SELECT * FROM users WHERE email = ?"
 
//    db.query(q,[email], (err,data)=>{
//     if(err) return res.status(500).json(err) //problem reaching the db
//     if(data.length) return res.status(409).json("User already exsist!") //if user exsist
 
 
// try {
//     /*const user = "shelly"
//     const assistant = await openai.beta.assistants.create({
//       name: `${user}`,
//       //instructions: instruction,
//       tools: [{ type: "code_interpreter" }],
//       model: "gpt-3.5-turbo",
//     });*/

//     // Insert user into the database with the assistant ID
//     /*await connectionDb.query(
//         "INSERT INTO users (email, password,name, id) VALUES (?, ?, ?, ?)",
//         [email,password,name, assistant.id]
//     );*/

//     db.query(
//       "INSERT INTO users (email, password,username) VALUES (?, ?, ?)",
//       [email,password,username]
//   );

//     console.log("Registration succeeded");
//     res.json({ message: "success" });
// } catch (err) {
//     console.error(err);
//     res.json({ message: "error", error: err });
// }
// })});

app.post('/api/savewords', async (req, res) => {
  const { userId, tasks } = req.body;
  console.log("in the back");
  try {
    await db.promise().query(`CREATE TABLE IF NOT EXISTS wordsuser_${userId} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      tran VARCHAR(255),
      UNIQUE KEY name (name)  
    )`);


    for (const task of tasks) {
      await db.promise().query(`
        INSERT INTO wordsuser_${userId} (name, tran) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE name = name`, [task.name, task.tran]);
    }

    res.status(200).json({ message: 'Words saved successfully' });
  } catch (error) {
    console.error('Error saving words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const pool = createPool(db);

app.get('/api/words/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log("try to get words for userId:", userId);
  try {
    const [rows] = await db.promise().query(`SELECT * FROM wordsuser_${userId}`);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching user\'s words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// app.post('/api/login/', (req, res) => {

//     try {
//          db.query("SELECT * FROM users WHERE email = ?", [req.body.email], (err, data) =>{

//           if (data.length > 0) {
//             const user = data[0];

//             const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
//             if (!checkPassword) return res.status(400).json("Wrong password or username");

//             console.log("Login succeeded");
//             //res.json({ message: "success", name: user.name });
//             console.log(user.id);
//             const token = jwt.sign({ id: data[0].id }, "secretkey");
//             const { password, ...others } = data[0];
        
//             res.cookie("accessToken", token, { httpOnly: false }).status(200).json(others);
//             //const thread = await openai.beta.threads.create();
//             // let run = await openai.beta.threads.runs.create(thread.id, {
//             //     assistant_id: user.id,
//             //     instructions: `you are an math teacher that only ask questions. ask now!`,
//             //   });

//             // module.exports = {
//             //     openai,
//             //     userId: user.id,
//             //     thread,
//             //     run
//             //   };
//            // botAssisten(user.id,thread)
//             }
//         else {
//             console.log("Username not found");
//             return res.status(409).json("User not found!")
//         }

//         });
//     } catch (err) {
//         console.error(err);
//         res.json({ message: "error", error: err });
//     }
// });*/

app.listen(8800,() =>{
  console.log("connected")
});



        

  
