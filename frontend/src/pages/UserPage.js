import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; 
import './UserPage.css';
import axios from 'axios';

const UserPage = () => {
  const [userData, setUserData] = useState(null); // Set initial state to null
  const [error, setError] = useState(''); // For handling errors

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Adjust the API endpoint and include credentials if necessary
        const response = await axios.get( 'http://127.0.0.1:8000/api/user-info/', { withCredentials: true });
        setUserData(response.data); // Set user data on successful fetch
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setError('Erro ao carregar os dados do usuário.');
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to fetch data only on component mount

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!userData) {
    return <div className="loading-message">Carregando dados do usuário...</div>;
  }

  return (
    <div>
      <Header />
      <div className="user-page-container">
        <div className="profile-photo-container">
          {userData.photo ? (
            <img src={userData.photo} alt={`${userData.fullname}'s profile`} className="profile-photo" />
          ) : (
            <div className="profile-photo-placeholder">{userData.initials}</div>
          )}
        </div>
        <div className="user-info-container">
          <h1>{userData.fullname}</h1>
          <p><strong>Nome de usuário:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>NUSP:</strong> {userData.nusp}</p>
          <p><strong>Data de início:</strong> {userData.start_date}</p>
          <p><strong>Curso:</strong> {userData.course}</p>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
