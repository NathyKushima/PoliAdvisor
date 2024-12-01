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

  // Função para gerar os dados do gráfico
  const generateChartData = (label, value) => ({
    labels: ["2024"], // Anos como labels
    datasets: [
      {
        label: label,
        data: [value], // Valor da média
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.4,
      },
    ],
  });

  return (
    <div>
      <h1>
        {discipline.name} ({discipline.discipline_code})
      </h1>
      <button onClick={() => alert("Função para avaliar ainda não implementada!")}>
        Avaliar
      </button>
      <h3>Médias de 2024</h3>
      <div>
        <h4>Didática:</h4>
        <Line data={generateChartData("Didática", discipline.avg_teaching)} />
      </div>
      <div>
        <h4>Material:</h4>
        <Line data={generateChartData("Material", discipline.avg_material)} />
      </div>
      <div>
        <h4>Dificuldade:</h4>
        <Line data={generateChartData("Dificuldade", discipline.avg_difficulty)} />
      </div>
      <div>
        <h4>Avaliação Geral:</h4>
        <Line data={generateChartData("Avaliação Geral", discipline.avg_overall)} />
      </div>
    </div>
  );
};

export default DisciplineDetail;
