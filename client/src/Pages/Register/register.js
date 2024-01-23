import "./register.scss"
import { useState,useNavigate } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

function Register(){
 // const navigate = useNavigate();

    const[inputs,setInputs]= useState({
        username:"",
        email:"",
        password:"",
        name:"",
    })

    const[error,setErr]=useState(null);

    function handleChange(e){
        setInputs((prev)=>({...prev, [e.target.name] : e.target.value}));
        

    };

    async function handleClick(e){
        e.preventDefault();
        console.log(inputs);
       try{
            await axios.post("http://localhost:8800/api/register", inputs);
            setErr(null);
           // navigate("/login")
        }
        catch(err){
            setErr(err.response.data);
        }
    }

    return(
        <div className="Register">
            <div className="card">
                <div className="left">
                    <h1>Register</h1>
                    <form>
                        <input type="username" placeholder="Username" name="username" onChange={handleChange}></input>
                        <input type="email" placeholder="Email" name="email" onChange={handleChange}></input>
                        <input type="password" placeholder="Password" name="password" onChange={handleChange}></input>
                        <input type="text" placeholder="Full Name" name="name" onChange={handleChange}></input>     
                        {error}               
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>
                <div className="right">
                    <h1>English Web!</h1>
                    <p>The future of learning English.
                     Join us in this exciting journey to learn and improve your English.
                    </p>
                    <span>Do you have an account?</span>
                    <Link to="/login">
                    <button>Login</button>
                    </Link>
            </div>
            </div>
            
        </div>

    );
}

export default Register;