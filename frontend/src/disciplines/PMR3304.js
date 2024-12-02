import React, { useEffect, useState } from 'react';
import './PMR3304.css';
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
      <div className="disciplines">
          <div className="card">
          {disciplines.map((discipline, index) => (
          <div className="card" key={index}>
            <h3>{discipline.discipline__discipline_code} - {discipline.discipline__name}</h3>
            <p><strong>Avaliação Geral:</strong> {((discipline.avg_teaching + discipline.avg_material + discipline.avg_difficulty)  / 3).toFixed(1)}/10</p>
            <p><strong>Didática:</strong> {discipline.avg_teaching}/10</p>
            <p><strong>Material:</strong> {discipline.avg_material}/10</p>
            <p><strong>Dificuldade:</strong> {discipline.avg_difficulty}/10</p>
            <p>{discipline.reviews_count} avaliações</p>
          </div> 
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
