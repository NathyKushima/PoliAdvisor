import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { useParams, useNavigate } from "react-router-dom";
import './DisciplineDetails.css';
import Header from '../components/Header.js';


const DisciplineDetails = () => {
    const { id: disciplineId } = useParams();
    const [discipline, setDiscipline] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState("");

    const likeComment = async (commentId) => {
      try {
        const [likeRes] =  await Promise.all([
          axios.post(`https://poliadvisor.onrender.com/api/like/${commentId}/`, {}, { withCredentials: true }),
        ])
        console.log("Like response:", likeRes.data);
      } catch (error) {
        console.error("Error liking comment:", error);
      }
    };

  const create_comment = async (parent_commentId, comment_content, discipline_id) => {
    try {
      const [commentRes] =  await Promise.all([
        axios.post(`https://poliadvisor.onrender.com/api/create-comment/`, {'comment_content': comment_content, 'parent_comment' : parent_commentId,
                                                                'discipline': discipline_id}, { withCredentials: true }),
      ])
      console.log("Comment response:", commentRes.data);
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const report_comment = async (coment_id, denounce_text) => {
    try {
      const [reportRes] =  await Promise.all([
        axios.post(`https://poliadvisor.onrender.com/api/report-comment/`, {'denounce_text': denounce_text, 'comment_id' : coment_id}, 
                                                        { withCredentials: true })]);
    } catch (error) {
      console.error("Error reporting comment:", error);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleReplySubmit = () => {
    create_comment(null, commentContent, disciplineId);
    setCommentContent("");
  };
  useEffect(() => {
    const fetchDisciplineDetails = async () => {
      try {
        console.log(`Fetching data for discipline ID: ${disciplineId}`);
        const [disciplineRes, commentsRes] = await Promise.all([
          axios.get(`https://poliadvisor.onrender.com/api/discipline/${disciplineId}/`),
          axios.get(`https://poliadvisor.onrender.com/api/comments/${disciplineId}/`)
        ]);
        /* console.log("Response data:", response.data); */
        setDiscipline(disciplineRes.data);
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

  const Comment = ({ comment }) => {
    const [isCommentBoxVisible, setCommentBoxVisible] = useState(false);
    const [isReportBoxVisible, setReportBoxVisible] = useState(false);
    const [commentContent, setCommentContent] = useState("");
    const [reportContent, setReportContent] = useState("");

    const handleReplySubmit = () => {
      create_comment(comment.id, commentContent, disciplineId);
      setCommentContent("");
      setCommentBoxVisible(false);
    };

    const handleReportSubmit = () => {
      report_comment(comment.id, reportContent);
      setReportContent("");
      setReportBoxVisible(false);
    };
    
    return (
    
    <div className="comment-thread">
      <div className="card-comment">
        <div className="comment-header">
          <p><strong>{comment.username}</strong></p>
        </div>
        <div className="comment_body">
          <p>{comment.comment_content}</p>
        </div>
        <div className="comment_footer">
          <strong>Publicado em:</strong> {comment.comment_date}
          <div className="comment_buttons">
          {comment.likes_count}
          <button className="like-button" onClick={() => likeComment(comment.id) }>Curtidas</button> 
          <button className="reply-button" onClick={() => setCommentBoxVisible(!isCommentBoxVisible) }>Comentar</button>
          <button className="report-button" onClick={() => setReportBoxVisible(!isReportBoxVisible) }>Denunciar</button>
          </div>
        </div>
      </div>

      {isCommentBoxVisible && (
        <div className="comment_box">
            <textarea
                className="comment_textarea"
                placeholder="Escreva seu comentário..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
            ></textarea>
            <button className="comment_button" onClick={handleReplySubmit}>
                Comentar
            </button>
            <button className="cancel_button" onClick={() => setCommentBoxVisible(false)}>
                Cancelar
            </button>
        </div>
      )}

      
      {isReportBoxVisible && (
        <div className="report_box">
            <textarea
                className="comment_textarea"
                placeholder="Escreva sua denúncia..."
                value={reportContent}
                onChange={(e) => setReportContent(e.target.value)}
            ></textarea>
            <button className="comment_button" onClick={handleReportSubmit}>
                Denunciar
            </button>
            <button className="cancel_button" onClick={() => setReportBoxVisible(false)}>
                Cancelar
            </button>
        </div>
      )}
    
      {comment.replies?.length > 0 && (
        <div className="replies">
          {comment.replies.map(reply => (
            <Comment key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>);
  };
  
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
              <button className="avalie-button" onClick={() => (window.location.href = '/evaluation/' + disciplineId)}>Avaliar</button>
              <div className="graph">
              <Line data={data} />
              </div>
              <div className="card-comments">
              <h2>Comentários</h2>
              
              </div>
              <div className="comment_box">
                <textarea
                    className="comment_textarea"
                    placeholder="Escreva seu comentário..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
                <button className="comment_button" onClick={handleReplySubmit}>
                    Comentar
                </button>
              </div>
              <CommentsList comments={comments} />
              
          </div>
      </div>
    </div>
  );
};

export default DisciplineDetails;
