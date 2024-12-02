import './App.css';
import React from 'react';
import Home from './pages/Home.js';
import LoginPage from './pages/LoginPage.js'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <main>
        <Router>
          <Routes>
            <Route path="" element={<Home />} />
            <Route path="LoginPage" element={<LoginPage />} />
          </Routes>
        </Router>
      </main>
    </div>
  );
}

export default App;


