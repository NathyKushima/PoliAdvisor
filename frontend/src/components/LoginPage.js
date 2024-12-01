import React, { useState } from 'react';
import './LoginPage.css';
import './Header.css';
import logo from '../logo_2_Poli.png';
import Header from './Header.js';

const LoginPage = () => {
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
      <div className="login-page">
        <div className="login-container">
          <h1>Login</h1>
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
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite sua senha"
                required
              />
            </div>
            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>
            <button className="btn-new" onClick={() => alert('Criar conta')}>
              Criar conta
            </button>
            <button className="btn-passoword" onClick={() => alert('Redefinir senha')}>
              Esqueci a senha
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
