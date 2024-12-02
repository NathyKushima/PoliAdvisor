import React, { useEffect } from 'react';
import Header from '../components/Header'; 
import './HomePage.css';

const UserPage = (props) => {

  /* props has user id, within useEffect, fetch user data from backend */

  return (
    <div>
      <Header />
      <h1>Welcome to the Home Page!</h1>
      <p>This is a simple page in your React app.</p>
    </div>
  );
};

export default UserPage;
