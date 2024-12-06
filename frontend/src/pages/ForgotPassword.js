import React, { useState } from 'react';
import './ForgotPassword.css';
import Header from '../components/Header.js';

const ForgotPassword = () => {
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
      <div className="forgot-page">
        <div className="forgot-container">
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
            <button onClick={() => (window.location.href = 'https://poliadvisor.onrender.com/email/')} className="btn-forgot">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
