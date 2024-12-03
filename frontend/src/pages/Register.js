import React, { useState } from "react";
import axios from "axios";
import logo from "../logo_Poliadvisor.png";
import './Register.css'
import Header from '../components/Header.js';

const Register = () => {
  const [formData, setFormData] = useState({
    nusp: "",
    fullname: "",
    username: "",
    course: "",
    start_date: "",
    email: "",
    password: "",
    confirm_password: "",
    status_user: 1,
    user_photo: null,
  });

  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, user_photo: file || null });
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.username || !formData.email || 
        !formData.password || !formData.confirm_password || 
        !formData.course || !formData.start_date) {
      setMessage("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setMessage("As senhas não coincidem.");
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataObj.append(key, value);
    });

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register/", formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Cadastro realizado com sucesso!");
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(`Erro: ${JSON.stringify(error.response.data)}`);
      } else {
        setMessage("Erro ao cadastrar. Verifique os dados.");
      }
    }
  };

  return (
    <div>
      <Header/>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro</h1>
        <input
          type="text"
          name="fullname"
          placeholder="Nome completo"
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          onChange={handleChange}
        />
        <div>
          <select name="course" value={formData.course} onChange={handleChange}>
            <option value="">Selecione o curso</option>
            <option value="ENG_AMBIENTAL">Engenharia Ambiental</option>
            <option value="ENG_CIVIL">Engenharia Civil</option>
            <option value="ENG_COMPUTACAO">Engenharia da Computação</option>
            <option value="ENG_MINAS">Engenharia de Minas</option>
            <option value="ENG_PETROLEO">Engenharia de Petróleo</option>
            <option value="ENG_NAVAL">Engenharia Naval</option>
            <option value="ENG_METALURGICA">Engenharia Metalúrgica</option>
            <option value="ENG_PRODUCAO">Engenharia de Produção</option>
            <option value="ENG_ELETRICA">Engenharia Elétrica</option>
            <option value="ENG_MECANICA">Engenharia Mecânica</option>
            <option value="ENG_MECATRONICA">Engenharia Mecatrônica</option>
            <option value="ENG_QUIMICA">Engenharia Química</option>
            <option value="ENG_MATERIAIS">Engenharia de Materiais</option>
          </select>
          <select name="start_date" value={formData.start_date} onChange={handleChange}>
            <option value="">Ano de Ingresso</option>
            <option value="2019">2019</option>
            <option value="2020">2020</option>
            <option value="2021">2021</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
          </select>
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email USP"
          onChange={handleChange}
        />
        <input
          type="number"
          name="nusp"
          placeholder="Número USP"
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirmação de senha"
          onChange={handleChange}
        />
        <input type="file" name="user_photo" onChange={handleFileChange} />
        <div>
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
              }}
            />
          ) : (
            <p>Nenhum arquivo adicionado</p>
          )}
        </div>
        <button href="/" type="submit">Finalizar Cadastro</button>
        <p>{message}</p>
      </form>
    </div>
  );
};

export default Register;
