import React from 'react';
import './Header.css';
import logo from '../logo_Poliadvisor.png';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Poli Advisor" className="logo-image" />
        <h1>Poli Advisor</h1>
      </div>
      <div className="search-bar">
            <input type="text" className="search-input" placeholder="Pesquisar disciplinas" />
            <button className="search-button">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="search-icon"
                >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
            </button>
        </div>

      <div className="login-button">
        <button onClick={() => window.location.href = '/login'} className="login">Entrar</button>
      </div>
    </header>
  );
};

export default Header;
