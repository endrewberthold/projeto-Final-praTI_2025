import React from "react";
import "../styles/components/cardlvl.sass";
import { 
  BiMath
} from "react-icons/bi";
import { 
  FaLanguage,
  FaFlask,
  FaMapMarkedAlt
} from "react-icons/fa";
import StatCardModal from "./StatCardModal.jsx";


function LevelCard({
  titulo,
  totalQuestoes,
  respondidas,
  textoBotao,
  onClick,
  dificuldade,
  numeroNivel,
  areaConhecimento = 'MT', // MT, LC, CN, CH
  modalStats = null,
  isLocked = false,
  previousLevelNumber = null,
}) {

  // Função para retornar o ícone baseado na área de conhecimento
  const getAreaIcon = (area) => {
    switch (area) {
      case 'MT': // Matemática e suas Tecnologias
        return <BiMath size={50} />;
      case 'LC': // Linguagens, Códigos e suas Tecnologias
        return <FaLanguage size={50} />;
      case 'CN': // Ciências da Natureza e suas Tecnologias
        return <FaFlask size={50} />;
      case 'CH': // Ciências Humanas e suas Tecnologias
        return <FaMapMarkedAlt size={50} />;
      default:
        return <BiMath size={50} />;
    }
  };

  // Função para retornar a cor padrão (todos os cards terão a mesma cor)
  const getAreaColor = (area) => {
    return '#4A90E2'; // Cor padrão azul para todos os cards
  };

  const handleCardClick = (e) => {
    if (isLocked) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick(e);
  };

  return (
    <div 
      className={`level-card ${isLocked ? 'level-card--locked' : ''}`}
      style={{ '--area-color': getAreaColor(areaConhecimento) }}
    >
      <div className="card-content-wrapper">
        <div className={`card-content ${isLocked ? 'card-content--locked' : ''}`}>
          {/* Ícone da área de conhecimento */}
          <div className="area-icon">
            {getAreaIcon(areaConhecimento)}
          </div>
          
          {/* Número do nível */}
          {numeroNivel && (
            <div className="level-number">
              {numeroNivel}
            </div>
          )}
          
          {/* Ícone de bloqueio */}
          {isLocked && (
            <div className="lock-icon">🔒</div>
          )}
          
          {/* Botão para navegar */}
          <button 
            className={`level-button ${isLocked ? 'level-button--locked' : ''}`}
            onClick={handleCardClick}
            disabled={isLocked}
          >
            {isLocked ? 'Bloqueado' : (textoBotao || 'Começar')}
          </button>
        </div>
        
        {/* Modal que aparece ao passar o mouse */}
        {modalStats && (
          <StatCardModal
            sessionTime={modalStats.sessionTime}
            accuracy={modalStats.accuracy}
            xpEarned={modalStats.xpEarned}
            timePerQuestion={modalStats.timePerQuestion}
            progress={modalStats.progress}
            isLocked={isLocked}
            previousLevelNumber={previousLevelNumber}
          />
        )}
      </div>
      
      {/* Label de dificuldade */}
      {dificuldade && (
        <div className="dificuldade-label">
          {dificuldade}
        </div>
      )}
    </div>
  );
}

export default LevelCard;
