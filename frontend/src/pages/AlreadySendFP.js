import React, { useState } from 'react';
import './AlreadySendFP.css';
import '../components/Header.css';
import Header from '../components/Header.js';

const AlreadySendFP = () => {
  const [formData, setFormData] = useState({ emailOrName: '', password: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <div>
      <Header/>
      <div className="already-page">
        <div className="already-container">
          <h1>Recuperar Senha</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="emailOrName"
                name="emailOrName"
                value={formData.emailOrName}
                onChange={handleInputChange}
                placeholder="Nome de usuário/email"
                required
              />
            </div>
            <button onClick={() => (window.location.href = 'http://127.0.0.1:8000/email/')} className="btn-forgot">
              Enviar
            </button>
            <h3>
                Enviamos um link para a recuperação da senha, check seu email.
            </h3>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AlreadySendFP;
