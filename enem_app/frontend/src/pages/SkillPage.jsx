import React, { useEffect, useState } from "react";
import Cardlvl from "../components/Cardlvl";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaArrowLeft, FaBookOpen, FaGlobeAmericas } from "react-icons/fa";
import { TbMathFunction } from "react-icons/tb";
import { GiMicroscope } from "react-icons/gi";
import "../styles/pages/skillPage.sass";

//import { startSessionAPI } from "../services/SkillsServices";

export default function SkillPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const areaId = params.id;

  console.log('SkillPage - areaId:', areaId);

  // Função para obter o título baseado no areaId
  const getPageTitle = () => {
    switch (areaId) {
      case 'LC':
        return 'Linguagens, Códigos e suas Tecnologias';
      case 'MT':
        return 'Matemática e suas Tecnologias';
      case 'CN':
        return 'Ciências da Natureza e suas Tecnologias';
      case 'CH':
        return 'Ciências Humanas e suas Tecnologias';
      default:
        return 'SkillPage';
    }
  };

  // Função para obter o ícone baseado no areaId (mesmos ícones do dashboard)
  const getAreaIcon = (area) => {
    switch (area) {
      case 'MT':
        return <TbMathFunction size={24} />;
      case 'LC':
        return <FaBookOpen size={24} />;
      case 'CN':
        return <GiMicroscope size={24} />;
      case 'CH':
        return <FaGlobeAmericas size={24} />;
      default:
        return <TbMathFunction size={24} />;
    }
  };

  // Função para obter a cor padrão (todos os botões terão a mesma cor)
  const getAreaColor = (area) => {
    return '#4A90E2'; // Cor padrão azul para todos os botões
  };

  // Função para navegar entre áreas
  const handleAreaNavigation = (newAreaId) => {
    navigate(`/skillPage/${newAreaId}`);
  };

  //const [levelId, setLevelId] = useState(0);

  function handleNavigate(e, number) {
    e.preventDefault();

    navigate(`./answer/${number}`, { state: { levelId: number } });
  }

  function handleGoBack() {
    navigate('/dashboard'); // Volta para a tela inicial (dashboard)
  }

  // Debug: verificar se o componente está renderizando
  console.log('SkillPage renderizando...', { areaId, accessToken });

  return (
    <div className="skill-page">
      <div className="skill-page-content">
        <button className="back-button" onClick={handleGoBack}>
          <FaArrowLeft size={16} />
          Voltar para Home
        </button>

        {/* Seletor de ícones de área */}
        <div className="area-icon-selector">
          <div className="icon-grid">
            {[
              { id: 'MT', label: 'Matemática', color: getAreaColor('MT') },
              { id: 'LC', label: 'Linguagens', color: getAreaColor('LC') },
              { id: 'CN', label: 'Ciências', color: getAreaColor('CN') },
              { id: 'CH', label: 'Humanas', color: getAreaColor('CH') }
            ].map((area) => (
              <button
                key={area.id}
                className={`icon-button ${areaId === area.id ? 'selected' : ''}`}
                onClick={() => handleAreaNavigation(area.id)}
                style={{ '--area-color': area.color }}
                title={area.label}
              >
                <div className="icon-wrapper">
                  {getAreaIcon(area.id)}
                </div>
              </button>
            ))}
          </div>
        </div>

        <h1>{getPageTitle()}</h1>

        <div className="pyramid-container">
          {/* Todos os 5 cards na mesma linha */}
          <div className="pyramid-row first-row">
            <Cardlvl
              titulo="lvl 001"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 1)}
              dificuldade="Fácil"
              numeroNivel={1}
              areaConhecimento={areaId}
            />
            <Cardlvl
              titulo="lvl 002"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 2)}
              dificuldade="Médio"
              numeroNivel={2}
              areaConhecimento={areaId}
            />
            <Cardlvl
              titulo="lvl 003"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 3)}
              dificuldade="Intermediário"
              numeroNivel={3}
              areaConhecimento={areaId}
            />
            <Cardlvl
              titulo="lvl 004"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 4)}
              dificuldade="Difícil"
              numeroNivel={4}
              areaConhecimento={areaId}
            />
            <Cardlvl
              titulo="lvl 005"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 5)}
              dificuldade="Expert"
              numeroNivel={5}
              areaConhecimento={areaId}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
