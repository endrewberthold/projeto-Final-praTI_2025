import React from "react";
import "../styles/components/cardlvl.sass";
import { BiMath } from "react-icons/bi";
import mathImage from "../assets/ChatGPT Image 10 de out. de 2025, 18_41_44.png";

function LevelCard({
  titulo,
  totalQuestoes,
  respondidas,
  textoBotao,
  onClick,
}) {
  const progressPercentage = (respondidas / totalQuestoes) * 100;
  const radius = 90;
  const circunferency = 2 * Math.PI * radius;
  const dashArray = circunferency * 0.95;
  const progressLength = (dashArray * progressPercentage) / 100;

  return (
    <div className="level-card">
      <div className="progress-circle">
        <svg className="progress-svg" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#c0d5f3ff"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${dashArray} ${circunferency}`}
            strokeDashoffset="0"
            className="progress-background"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#4e6dc2ff"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${progressLength} ${circunferency}`}
            strokeDashoffset="0"
            className="progress-foreground"
          />
        </svg>
        
        <div className="card-content">
          <div className="level-icon">
            <img src={mathImage} alt="Matemática" className="math-image" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LevelCard;
