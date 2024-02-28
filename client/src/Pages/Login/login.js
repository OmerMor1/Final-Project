import { Link, useNavigate } from "react-router-dom";
import "./login.scss"
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useState } from "react";


function Login(){
    const navigate = useNavigate();

    const[inputs,setInputs]=useState({
        email:"",
        password:""
    })

    const[error,setErr]=useState(null);

    function handleChange(e){
        setInputs((prev)=>({...prev, [e.target.name] : e.target.value}));

    };


    const {login} = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            await login(inputs);
            navigate("/")
        }catch(err){
            setErr(err.response.data)
        }
    };
    
    


    return(
        <div className="login">
            <div className="card">
                <div className="left">
                <h1>English Web!</h1>
                    <p>The future of learning English.
                     Join us in this exciting journey to learn and improve your English.
                    </p>
                    <span>Don't you have an account?</span>
                    <Link to="/register">
                    <button>Register</button>
                    </Link>
                    
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input type="text" placeholder="email" name="email" onChange={handleChange}></input>
                        <input type="password" placeholder="password" name="password" onChange={handleChange}></input>
                        {error}
                        <button onClick={handleLogin}>Login</button>
                   </form>
                    
                </div>
            </div>
        
        </div>

    );
}

export default Login;