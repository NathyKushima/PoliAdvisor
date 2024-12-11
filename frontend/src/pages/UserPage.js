import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; 
import './UserPage.css';
import axios from 'axios';

const UserPage = () => {
  const [userData, setUserData] = useState(null); // Set initial state to null
  const [userInteractions, setUserInteractions] = useState(null);
  const [error, setError] = useState(''); // For handling errors

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleLogout = async () => {
    try {
      await axios.post('api/logout/', {}, { withCredentials: true });
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userDataRes, userInteractionsRes] = await Promise.all([
          axios.get('api/user-info/', { withCredentials: true }),
          axios.get('api/user-interactions/', { withCredentials: true }),
        ]);
        setUserData(userDataRes.data);
        setUserInteractions(userInteractionsRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao carregar os dados.');
      }
    };

    fetchData();
    const csrftoken = getCookie('csrftoken'); // Read the CSRF token from the browser's cookies
    axios.defaults.headers['X-CSRFToken'] = csrftoken; // Set CSRF token header globally
  }, []);

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
              <img src={userData.photo} alt={`${userData.fullname}'s profile`} onerror="this.src='image/lupa.png';" className="profile-photo" />
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
        
        <div className="user-interactions-container">
          <h1>Interações do usuário</h1>
          <p><strog>Avaliações Realizadas:</strog> {userInteractions.evaluations_count}</p>
          <p><strog>Nº de comentários:</strog> {userInteractions.comments_count}</p>
          <p><strog>Curtidas recebidas:</strog> {userInteractions.likes_received_count}</p>
          <p><strog>Curtidas dadas:</strog> {userInteractions.likes_given_count}</p>
        </div>
        <button onClick={() => (window.location.href = '/EditProfile')} className="edit-profile">Edite Perfil</button>
        <button onClick={handleLogout} className="edit-profile">Logout</button>
        <div className="user-comments-container">
        {userInteractions.user_comments.map((comment, index) => (
          <div className="comment-container" key={index}>
            <div className="comment_header">
            <p><strong>Comentário:</strong> {comment.comment_content}</p>
            </div>
            <div className="comment_footer">
              <p><strong>Publicado em:</strong> {comment.comment_date}</p>
              <p><strong>Disciplina:</strong> {comment.discipline_name}</p>
              <p><strong>Curtidas:</strong> {comment.likes_count}</p>
            </div>
          </div>
        ))}
        </div>
      
    </div>
  );
};

export default UserPage;
