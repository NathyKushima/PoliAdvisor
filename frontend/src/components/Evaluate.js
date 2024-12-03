import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header.js'

const EvaluatePage = () => {
    const [teachingNote, setTeachingNote] = useState(null);
    const { id: disciplineId } = useParams();
    const [discipline, setDiscipline] = useState(null);
    const [loading, setLoading] = useState(true);
    const [materialNote, setMaterialNote] = useState(null);
    const [difficultyNote, setDifficultyNote] = useState(null);
    const [year, setYear] = useState(null);
    const navigate = useNavigate(); // Garantir a navegação após submissão, se necessário

    // Função para enviar a avaliação
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            teachingNote < 0 || teachingNote > 10 ||
            materialNote < 0 || materialNote > 10 ||
            difficultyNote < 0 || difficultyNote > 10
        ) {
            alert("Notas devem estar entre 0 e 10.");
            return;
        }

        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/evaluate/${disciplineId}/`,
            {
                'semester_completed': year,
                'note_teaching': teachingNote,
                'note_material': materialNote,
                'note_difficulty': difficultyNote,
            },
            { withCredentials: true }
        );
        // Show the response message in the alert
        alert(response.data.message );
        navigate('/discipline/' + disciplineId); // Navigate to another page, if needed
        } catch (error) {
            console.error('Erro ao salvar a avaliação:', error);
            alert('Erro ao salvar a avaliação. Tente novamente.');
        }
    };

    
    const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };


  // Função para buscar os detalhes da disciplina
  useEffect(() => {
    const fetchDisciplineDetails = async () => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/api/discipline/${disciplineId}/`);
          setDiscipline(response.data);
      } catch (error) {
          console.error("Erro ao buscar detalhes da disciplina:", error);
          alert("Erro ao carregar os detalhes da disciplina.");
      } finally {
          setLoading(false);
      }
    };
    const csrftoken = getCookie('csrftoken'); // Read the CSRF token from the browser's cookies
    axios.defaults.headers['X-CSRFToken'] = csrftoken; // Set CSRF token header globally
    fetchDisciplineDetails();
  }, [disciplineId]);

    // Renderização condicional enquanto os dados estão sendo carregados
    if (loading) return <p>Carregando...</p>;
    if (!discipline) return <p>Disciplina não encontrada ou erro na API.</p>;

    return (
        <div>
          <Header/>
            <h1>Avaliar Disciplina: {discipline.name}</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nota para Ensino:
                    <input
                        type="number"
                        value={teachingNote}
                        onChange={(e) => setTeachingNote(Number(e.target.value))}
                        min="0"
                        max="10"
                    />
                </label>
                <br />
                <label>
                    Nota para Material:
                    <input
                        type="number"
                        value={materialNote}
                        onChange={(e) => setMaterialNote(Number(e.target.value))}
                        min="0"
                        max="10"
                    />
                </label>
                <br />
                <label>
                    Nota para Dificuldade:
                    <input
                        type="number"
                        value={difficultyNote}
                        onChange={(e) => setDifficultyNote(Number(e.target.value))}
                        min="0"
                        max="10"
                    />
                </label>
                <br />
                <label>
                    Ano:
                    <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                        {[2019, 2020, 2021, 2022, 2023, 2024].map((yr) => (
                            <option key={yr} value={yr}>{yr}</option>
                        ))}
                    </select>
                </label>
                <br />
                <button type="submit">Enviar Avaliação</button>
            </form>
        </div>
    );
};

export default EvaluatePage;
