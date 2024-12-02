<<<<<<< HEAD
import React, { useEffect } from 'react';
import Header from '../components/Header.js'; 
import './HomePage.css';
=======
import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; 
import './UserPage.css';
import axios from 'axios';
>>>>>>> 908643182e81b6b0f18660a63d40e03a29f2061f

const UserPage = () => {
  const [userData, setUserData] = useState(null); // Set initial state to null
  const [userInteractions, setUserInteractions] = useState(null);
  const [error, setError] = useState(''); // For handling errors

  const fetchUserData = async () => {
    try {
      // Adjust the API endpoint and include credentials if necessary
      const response = await axios.get( `api/user-info/`, { withCredentials: true });
      setUserData(response.data); // Set user data on successful fetch
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setError('Erro ao carregar os dados do usuário.');
    }
  };
  const fetchUserInteractions = async () => {
    try {
      const response = await axios.get('api/user-interactions/', { withCredentials: true });
      setUserInteractions(response.data);
    } catch (error) {
      console.error('Erro ao buscar interações do usuário:', error);
      setError('Erro ao carregar as interações do usuário.');
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserInteractions();
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
        <div className="user-interactions-container">
          <h2>Interações do usuário</h2>
          <p><strog>Avaliações Realizadas:</strog> {userInteractions.evaluations_count}</p>
          <p><strog>Nº de comentários:</strog> {userInteractions.comments_count}</p>
          <p><strog>Curtidas recebidas:</strog> {userInteractions.likes_received_count}</p>
          <p><strog>Curtidas dadas:</strog> {userInteractions.likes_given_count}</p>
        </div>
        <div className="user-comments-container">
        {userInteractions.user_comments.map((comment, index) => (
          <div className="comment-container" key={index}>
            <p><strong>Comentário:</strong> {comment.coment_content}</p>
            <p><strong>Publicado em:</strong> {comment.comment_date}</p>
            <p><strong>Disciplina:</strong> {comment.discipline_name}</p>
            <p><strong>Curtidas:</strong> {comment.likes_count}</p>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
