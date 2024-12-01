import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";

const DisciplineDetail = ({ disciplineId }) => {
  const [discipline, setDiscipline] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/discipline/${disciplineId}/`)
      .then((response) => setDiscipline(response.data))
      .catch((error) => console.error(error));
  }, [disciplineId]);

  if (!discipline) {
    return <p>Loading...</p>;
  }

  const data = {
    labels: ["2024"],
    datasets: [
      {
        label: "Didática",
        data: [discipline.avg_teaching],
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.3)",
      },
      {
        label: "Material",
        data: [discipline.avg_material],
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.3)",
      },
      {
        label: "Dificuldade",
        data: [discipline.avg_difficulty],
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.3)",
      },
      {
        label: "Avaliação Geral",
        data: [discipline.avg_overall],
        borderColor: "purple",
        backgroundColor: "rgba(128, 0, 128, 0.3)",
      },
    ],
  };

  return (
    <div>
      <h1>{discipline.name} ({discipline.discipline_code})</h1>
      <button onClick={() => alert("Função para avaliar ainda não implementada!")}>
        Avaliar
      </button>
      <h3>Médias de 2024</h3>
      <p>Didática: {discipline.avg_teaching}</p>
      <p>Material: {discipline.avg_material}</p>
      <p>Dificuldade: {discipline.avg_difficulty}</p>
      <p>Avaliação Geral: {discipline.avg_overall}</p>
      <Line data={data} />
    </div>
  );
};

export default DisciplineDetail;
