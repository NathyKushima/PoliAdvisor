import React, { useEffect, useState } from 'react';
import './Home.css';
import axios from 'axios';
import Header from './components/Header';

const Home = () => {
  const [disciplines, setDisciplines] = useState([]);

  const fetchDisciplines = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/best-disciplines/');
      setDisciplines(response.data);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  useEffect(() => {
    fetchDisciplines();
  }, []);

  return (
    <div className="home">
      <h2>Mais pesquisadas</h2>
      <div className="disciplines">
        {disciplines.map((discipline, index) => (
          <div className="card" key={index}>
            <h3>{discipline.discipline__discipline_code} - {discipline.discipline__name}</h3>
            <p><strong>Avaliação Geral:</strong> {((discipline.avg_teaching + discipline.avg_material + discipline.avg_difficulty) / 3).toFixed(1)}/10</p>
            <p><strong>Didática:</strong> {discipline.avg_teaching.toFixed(1)}/10</p>
            <p><strong>Material:</strong> {discipline.avg_material.toFixed(1)}/10</p>
            <p><strong>Dificuldade:</strong> {discipline.avg_difficulty.toFixed(1)}/10</p>
            <p>{discipline.reviews_count} avaliações</p>
            <button className="comments-button">Comentários ({discipline.reviews_count})</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
