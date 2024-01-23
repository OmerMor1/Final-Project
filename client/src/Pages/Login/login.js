import "./login.scss"
import { Link, useNavigate } from "react-router-dom";
//import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import { useState } from "react";


function Login(){
  
   // const navigate = useNavigate();

    const[inputs,setInputs]=useState({
        username:"",
        password:""
    })

    const[error,setErr]=useState(null);

    function handleChange(e){
        setInputs((prev)=>({...prev, [e.target.name] : e.target.value}));

    };


    //const {login} = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
       /* try{
            await login(inputs);
            navigate("/")
        }catch(err){
            setErr(err.response.data)
        }*/
    };


    return(
        <div className="login">
            <div className="card">
                <div className="left">
                    <h1>English Web!</h1>
                    <p>The future of learning English.
                     Join us in this exciting journey to learn and improve your English.</p>
                    <span>Don't you have an account?</span>
                    <Link to="/register">
                    <button>Register</button>
                    </Link>
                    
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input type="text" placeholder="username" name="username" ></input>
                        <input type="password" placeholder="password" name="password" ></input>
                        <button>Login</button>
                   </form>
                    
                </div>
            </div>
        
        </div>

    );
}

export default Login;