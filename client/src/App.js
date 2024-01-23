import React from 'react';
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import Home from './Pages/Home/home.js';
import Login from './Pages/Login/login.js';
import Register from './Pages/Register/register.js';


function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes >
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
  );
}

export default App;
