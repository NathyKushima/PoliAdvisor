import React, { useState } from 'react';
import axios from 'axios';
import './Header.css';
import logo from '../logo_Poliadvisor.png';

const Header = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  // Função para buscar sugestões da API
  const handleSearch = async (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    if (searchValue.length > 1) {
      try {
        const response = await axios.get(`/api/search/?q=${searchValue}`);
        const departmentSuggestions = response.data.departments.map((dept) => ({
          id: `dept-${dept.id}`,
          label: `${dept.department_name} (${dept.department_code})`,
        }));
        const disciplineSuggestions = response.data.disciplines.map((disc) => ({
          id: `disc-${disc.id}`,
          label: `${disc.name} (${disc.discipline_code})`,
        }));

        setSuggestions([...departmentSuggestions, ...disciplineSuggestions]);
        setDropdownVisible(true);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setSuggestions([]);
        setDropdownVisible(false);
      }
    } else {
      setSuggestions([]);
      setDropdownVisible(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setQuery(suggestion.label);
    setSuggestions([]);
    setDropdownVisible(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Poli Advisor" className="logo-image" />
        <h1>Poli Advisor</h1>
      </div>
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar disciplinas"
          value={query}
          onChange={handleSearch}
          onFocus={() => setDropdownVisible(suggestions.length > 0)}
          onBlur={() => setTimeout(() => setDropdownVisible(false), 200)} // Para permitir clicar na sugestão
        />
        <button className="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        {isDropdownVisible && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="suggestion-item"
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="login-button">
        <button onClick={() => (window.location.href = '/login')} className="login">
          Entrar
        </button>
      </div>
    </header>
  );
};

export default Header;
