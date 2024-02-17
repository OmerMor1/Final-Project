import {React, useContext} from 'react';
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import Home from './Pages/Home/home.js';
import Login from './Pages/Login/login.js';
import Logout from './Pages/Logout/logout.js';
import { AuthContext } from './context/authContext';
import Register from './Pages/Register/register.js';
import "./app.scss"


function App() {
  const {currentUser} = useContext(AuthContext);
  console.log(currentUser);
  return (
    <div className="App">
        <BrowserRouter>
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
