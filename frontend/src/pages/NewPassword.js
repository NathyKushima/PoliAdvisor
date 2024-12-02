import React, { useState } from 'react';
import './NewPassword.css';
import '../components/Header.css';
import Header from '../components/Header.js';

const NewPassword = () => {
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
      <div className="new-page">
        <div className="new-container">
          <h1>Nova Senha</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="emailOrName"
                name="emailOrName"
                value={formData.emailOrName}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                id="emailOrName"
                name="emailOrName"
                value={formData.emailOrName}
                onChange={handleInputChange}
                placeholder="Digite novamente sua senha"
                required
              />
            </div>
            <button onClick={() => (window.location.href = 'http://127.0.0.1:8000/email/')} className="btn-new">
              Enviar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
