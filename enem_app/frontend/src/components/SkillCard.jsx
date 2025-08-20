import React, { useState } from "react";
import "./skillcard.sass"
import { BiMath } from "react-icons/bi";

const CardHabilidade = ({
  titulo,
  porcentagem,
  questoes,
  conteudoVerso
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = () => setIsFlipped(true);
  const handleMouseLeave = () => setIsFlipped(false);

  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-inner">
        {/* Frente do Card */}
        <div className="card-front">
          <div className="front-icon">
            <BiMath />
          </div>
          <h3 className="title">{titulo}</h3>
          
          <div className="progress-container">
            <span className="percent">{porcentagem}%</span>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>
          
          <p className="questions-count">{questoes} questões</p>
        </div>

        {/* Verso do Card */}
        <div className="card-back">
          <div className="icon-container">
            <div className="icon-background"></div>
            <div className="back-icon">
              <BiMath />
            </div>
          </div>
          
          <div className="topics">
            {conteudoVerso.map((topico, index) => (
              <span key={index}>{topico}</span>
            ))}
          </div>
          
          <button className="button">Responder</button>
        </div>
      </div>
    </div>
  );
};

export default CardHabilidade;