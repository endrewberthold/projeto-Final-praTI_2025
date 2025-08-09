import React, { useState } from "react";

const CardHabilidade = ({
  icone: Icone,
  titulo,
  porcentagem,
  questoes,
  conteudoVerso,
}) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`card${flipped ? " card--flipped" : ""}`}
      onMouseOver={() => setFlipped(!flipped)}
    >
      <div className="card__inner">
        {/* Lado da frente*/}
        <div className="card__face card__face--front">
          <div className="card__icon">
            <Icone />
          </div>
          <div className="card__title">{titulo}</div>
          <p className="card__percentText">{porcentagem}%</p>
          <div className="card__progress">
            <div className="card__progress-bar" />
          </div>
          <p className="card__questionsText">{questoes} questões</p>
        </div>

        {/* Lado de trás*/}
        <div className="card__face card__face--back">
          <div className="card__icon-container">
            <div className="card__icon-background"></div>
            <div className="card__icon-foreground">
              <Icone />
            </div>
          </div>
          <div className="card__topics">
            {conteudoVerso.map((topico, index) => (
              <span key={index}>{topico}</span>
            ))}
          </div>
          <button className="card__button">Responder</button>
        </div>
      </div>
    </div>
  );
};

export default CardHabilidade;
