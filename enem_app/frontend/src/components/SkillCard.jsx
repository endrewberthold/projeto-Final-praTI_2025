import React, { useState } from "react";
import "../styles/components/skillCard.sass"
import { BiMath } from "react-icons/bi";

const CardSkill = ({
  titulo,
  porcentagem,
  questoes,
  textoBotao,
  onClick,
  conteudoVerso
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => setIsFlipped((prev) => !prev);

  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`}
      onClick={handleCardClick}
    >
      <div className="card-inner">
        {/* Frente do Card */}
        <div className="card-front card-face">
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
        <div className="card-back card-face">
          <div className="icon-container">
            <div className="icon-background"></div>
            <div className="back-icon">
              <BiMath />
            </div>
          </div>
          
          <div className="topics">
            <ul className="topics-ul">
              {Array.isArray(conteudoVerso) && conteudoVerso.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          
           <footer className="skill-footer">
        <button className="skill-button" onClick={onClick}>
          {textoBotao}
        </button>

      </footer>
    </div>
        </div>
      </div>

  );
};

export default CardSkill;