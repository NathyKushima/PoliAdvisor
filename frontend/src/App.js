import './App.css';
import React from 'react';
import Home from './pages/Home.js';
import LoginPage from './pages/LoginPage.js';
import ForgotPassword from './pages/ForgotPassword.js';
import NewPassword from './pages/NewPassword.js';
import AlreadySendFP from './pages/AlreadySendFP.js';
import DisciplineDetails from './pages/DisciplineDetails.js';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/discipline/:id" element={<DisciplineDetails />} />
      </Routes>
    </Router>
  );
}

export default App;


