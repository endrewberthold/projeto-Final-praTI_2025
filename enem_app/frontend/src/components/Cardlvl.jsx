import React from "react";
import "../styles/components/cardlvl.sass";
import { BiMath } from "react-icons/bi";

function LevelCard({
  titulo,
  totalQuestoes,
  respondidas,
  textoBotao,
  onClick,
}) {
  return (
    <div className="level-card">
      <div className="level-icon">
        <BiMath />
      </div>

      <div className="level-title">{titulo}</div>

      <div className="level-subtitle">
        {respondidas} / {totalQuestoes}
      </div>

      <div className="level-footer">
        <button className="level-button" onClick={onClick}>
          {textoBotao}
        </button>
      </div>
    </div>
  );
}

export default LevelCard;
