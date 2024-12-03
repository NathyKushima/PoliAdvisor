import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';
import Header from '../components/Header.js';

const Home = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);
  }

  const fetchDisciplines = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/best-disciplines/');
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  }

  useEffect(() => {
    fetchDisciplines();
  }, []);

  return (
    <div>
      <Header/>
        <div className="home">
        <h2>Melhores avaliadas - </h2>
        <div className="disciplines">
        {disciplines.map((discipline, index) => (
          <div className="card-home" key={index}>
            <a href={'/discipline/' + discipline.discipline__id}><h3>{discipline.discipline__discipline_code} - {discipline.discipline__name}</h3></a>
            <p><strong>Avaliação Geral:</strong> {((discipline.avg_teaching + discipline.avg_material + discipline.avg_difficulty) / 3).toFixed(1)}/10</p>
            <p><strong>Didática:</strong> {discipline.avg_teaching.toFixed(1)}/10</p>
            <p><strong>Material:</strong> {discipline.avg_material.toFixed(1)}/10</p>
            <p><strong>Dificuldade:</strong> {discipline.avg_difficulty.toFixed(1)}/10</p>
            <p>{discipline.reviews_count} avaliações</p>
            <button onClick={() => (window.location.href = '/discipline/' + discipline.discipline__id)} className="comments-button">Comentários ({discipline.reviews_count})</button>
          </div>
        ))}  
      </div>
      </div>
    </div>
  );
};

export default Home;
