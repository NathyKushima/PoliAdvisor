import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useParams } from "react-router-dom";

const DisciplineDetails = () => {
    const { id: disciplineId } = useParams();
    const [discipline, setDiscipline] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchDisciplineDetails = async () => {
        try {
          console.log(`Fetching data for discipline ID: ${disciplineId}`);
          const response = await axios.get(`http://127.0.0.1:8000/api/discipline/${disciplineId}/`);
          console.log("Response data:", response.data);
          setDiscipline(response.data);
        } catch (error) {
          console.error("Error fetching discipline details:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchDisciplineDetails();
    }, [disciplineId]);
  
    if (loading) return <p>Carregando...</p>;
    if (!discipline) return <p>Disciplina não encontrada ou erro na API.</p>;

  // Preparar dados para o gráfico
  const years = discipline.averages.map(avg => avg.semester_completed);
  const data = {
    labels: years,
    datasets: [
      {
        label: "Didática",
        data: discipline.averages.map(avg => avg.avg_teaching || null),
        borderColor: "blue",
        fill: false,
      },
      {
        label: "Material",
        data: discipline.averages.map(avg => avg.avg_material || null),
        borderColor: "green",
        fill: false,
      },
      {
        label: "Dificuldade",
        data: discipline.averages.map(avg => avg.avg_difficulty || null),
        borderColor: "red",
        fill: false,
      },
      {
        label: "Avaliação Geral",
        data: discipline.averages.map(avg => avg.avg_general || null),
        borderColor: "purple",
        fill: false,
      },
    ],
  };

  return (
    <div>
      <h1>Detalhes da Disciplina</h1>
      <p><strong>Código:</strong> {discipline.discipline_code}</p>
      <p><strong>Nome:</strong> {discipline.name}</p>
      <button onClick={() => alert("Avaliação ainda não implementada!")}>Avaliar</button>
      <h2>Médias por Ano</h2>
      <Line data={data} />
    </div>
  );
};

export default DisciplineDetails;
