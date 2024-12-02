import './App.css';
import React from 'react';
import Home from './pages/Home.js';
import LoginPage from './pages/LoginPage.js';
import ForgotPassword from './pages/ForgotPassword.js';
import NewPassword from './pages/NewPassword.js';
import AlreadySendFP from './pages/AlreadySendFP.js';
import Register from './pages/Register.js';
import UserPage from './pages/UserPage.js';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <main>
        <Router>
          <Routes>
            <Route path="" element={<Home/>}/>
            <Route path="LoginPage" element={<LoginPage />} />
            <Route path="ForgotPassword" element={<ForgotPassword/>}/>
            <Route path="NewPassword" element={<NewPassword/>}/>
            <Route path="AlreadySendFP" element={<AlreadySendFP/>}/>
            <Route path="Register" element={<Register/>}/>
            <Route path="userPage" element={<UserPage/>}/>
            <Route path="disc-1" element={<Discipline1 />}/>
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;


