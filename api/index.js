
import express  from "express";
import cors from "cors"
import bodyParser from "body-parser";
import axios from "axios";

import {db} from "./connect.js"
import bcrypt from "bcryptjs";
import jwt  from "jsonwebtoken";


const app= express();
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

app.use(cors({
    origin:"http://localhost:3000"
}));


app.post("/api/register/" ,  (req,res) => {
   //check if user exsist
   const q= "SELECT * FROM users WHERE username = ?"
  
   db.query(q,[req.body.username], (err,data)=>{
    if(err) return res.status(500).json(err) //problem reaching the db
    if(data.length) return res.status(409).json("User already exsist!") //if user exsist

    //create a new user and hash the password

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password , salt);

    const q = "INSERT INTO users (`username` , `email` , `password`, `name`) VALUES (?, ?, ?, ?)";
    db.query(q, [req.body.username, req.body.email, hashedPassword , req.body.name], (err,data) =>{
        if(err) return res.status(500).json(err)
        return res.status(200).json("User has been created!")
    })

   })
});


app.listen(8800,() =>{
    console.log("connected")
});