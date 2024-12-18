import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import './LoginPage.css';
import Header from '../components/Header.js';
import logo from '../logo_2_Poli.png';

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [message, setMessage] = useState(''); // For displaying login errors or success
  const navigate = useNavigate();
  
  useEffect(() => {
    const csrftoken = getCookie('csrftoken'); // Read the CSRF token from the browser's cookies
    axios.defaults.headers['X-CSRFToken'] = csrftoken; // Set CSRF token header globally
  }, []);

  // Helper function to get the CSRF token from cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    const { username, password } = formData;

    // Send login request with the correct field (username, password)
    try {
      
      const response = await axios.post(
        'https://poliadvisor.onrender.com/api/login/', 
        {username, password}, 
        { withCredentials: true },
      );
      
      setMessage('Login realizado com sucesso!');  // Handle success message
      console.log(response.data);  // You can handle the response here as needed
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Erro: ${error.response.data.detail || 'Falha ao fazer login.'}`);
      } else {
        setMessage('Erro desconhecido. Tente novamente.');
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="login-page">
        <div className="login-container">
          <div className="header-container">
              <h1>Poli Advisor</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nome de usuário"
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
        {message && <div className="message">{message}</div>} {/* Display message */}
        <button className="btn-new" onClick={() => (window.location.href = '/Register')}>
          Criar conta
        </button>
        <button className="btn-password" onClick={() => (window.location.href = '/ForgotPassword')}>
          Esqueci a senha
        </button>
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
