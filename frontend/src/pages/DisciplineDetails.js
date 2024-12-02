import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useParams } from "react-router-dom";
import './DisciplineDetails.css';
import Header from '../components/Header.js';

const DisciplineDetails = () => {
    const { id: disciplineId } = useParams();
    const [discipline, setDiscipline] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const likeComment = async (commentId) => {
      try {
        const [likeRes] =  await Promise.all([
          axios.post(`http://127.0.0.1:8000/api/like/${commentId}/`, { withCredentials: true }),
        ])
        console.log("Like response:", likeRes.data);
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    };

  const create_comment = async (parent_commentId) => {
    try {
      const [commentRes] =  await Promise.all([
        axios.post(`http://127.0.0.1:8000/api/create_comment/${parent_commentId}/`),
      ])
      console.log("Comment response:", commentRes.data);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };


  useEffect(() => {
    const fetchDisciplineDetails = async () => {
      try {
        console.log(`Fetching data for discipline ID: ${disciplineId}`);
        const [disciplieRes, commentsRes] = await Promise.all([
          axios.get(`http://127.0.0.1:8000/api/discipline/${disciplineId}/`),
          axios.get(`http://127.0.0.1:8000/api/comments/${disciplineId}/`)
        ]);
        /* console.log("Response data:", response.data); */
        setDiscipline(disciplieRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching discipline details:", error);
      } finally {
        setLoading(false);
      }
    };
  
      fetchDisciplineDetails();
      const csrftoken = getCookie('csrftoken'); // Read the CSRF token from the browser's cookies
      axios.defaults.headers['X-CSRFToken'] = csrftoken; // Set CSRF token header globally
    }, [disciplineId]);
  
    if (loading) return <p>Carregando...</p>;
    if (!discipline) return <p>Disciplina não encontrada ou erro na API.</p>;

  const data2024 = discipline.averages.find(avg => avg.semester_completed === 2024) || {};

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

  const Comment = ({ comment }) => (
    <div className="comment_container">
      <div className="comment_header">
        <p><strong>{comment.username}</strong></p>
      </div>
      <div className="comment_body">
        <p>{comment.comment_content}</p>
      </div>
      <div className="comment_footer">
        <strong>Publicado em:</strong> {comment.comment_date}
        <button className="like-button" onClick={() =>likeComment(comment.id) }>{comment.likes_count}</button> 
        <button className="reply-button" onClick={() => alert("Resposta ainda não implementada!")}>Responder</button>
        <button className="report-button" onClick={() => alert("Reportar ainda não implementado!")}>Reportar</button>
      </div>

      {comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
  
  const CommentsList = ({ comments }) => (
    <div className="comments-list">
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );

  return (
    <div>
      <Header/>
      <div className="discipline">
          <div className="card-discipline">
            <h1>Detalhes da Disciplina</h1>
            <p><strong>{discipline.discipline_code} - {discipline.name}:</strong> </p>
            
            <p>Último oferecimento (2024):</p>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "purple", borderRadius: "50%", marginRight: "8px" }}></span>
                  <span>Avaliação Geral: <strong>{data2024.avg_general?.toFixed(2) || "N/A"}</strong></span>
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "blue", borderRadius: "50%", marginRight: "8px" }}></span>
                  <span>Didática: <strong>{data2024.avg_teaching?.toFixed(2) || "N/A"}</strong></span>
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "green", borderRadius: "50%", marginRight: "8px" }}></span>
                  <span>Material: <strong>{data2024.avg_material?.toFixed(2) || "N/A"}</strong></span>
                </p>
                <p style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ width: "10px", height: "10px", backgroundColor: "red", borderRadius: "50%", marginRight: "8px" }}></span>
                  <span>Dificuldade: <strong>{data2024.avg_difficulty?.toFixed(2) || "N/A"}</strong></span>
                </p>
              </ul>
              <button className="avalie-button" onClick={() => alert("Avaliação ainda não implementada!")}>Avaliar</button>
              <div className="graph">
            <Line data={data} />
            </div>
          </div>
        </div>
        <div className="card-comments">
            <h2>Comentários</h2>
            <CommentsList comments={comments} />
        </div>
    </div>
  );
};

export default DisciplineDetails;
