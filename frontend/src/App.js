import './App.css';
import React from 'react';
import Header from './components/Header.js';
import LoginPage from './pages/LoginPage.js';
import Register from './pages/Register.js';
import DisciplinePage from './pages/DisciplinePage.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/discipline/:1" element={<DisciplinePage />} />
      </Routes>
    </Router>
  );
};


export default App;


