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


function LevelCard({
  titulo,
  totalQuestoes,
  respondidas,
  textoBotao,
  onClick,
  dificuldade,
  numeroNivel,
  areaConhecimento = 'MT', // MT, LC, CN, CH
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

  return (
    <div 
      className="level-card"
      style={{ '--area-color': getAreaColor(areaConhecimento) }}
    >
      <div className="card-content">
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
        
        {/* Botão para navegar */}
        <button 
          className="level-button"
          onClick={onClick}
        >
          {textoBotao || 'Começar'}
        </button>
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
