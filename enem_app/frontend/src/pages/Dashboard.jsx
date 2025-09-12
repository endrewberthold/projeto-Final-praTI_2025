import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pages/dashboard.sass";

//import NavBar from "../components/NavBar";
import FlashCardDashboard from "../components/FlashCardDashboard";
import UserStatusDashboard from "../components/UserStatusDashboard";
import CardSkillsDashboard from "../components/CardSkillsDashboard";
//import { BiMath } from "react-icons/bi";

export default function Dashboard() {
  return (
    <div className="container-dashboard">
      <h1>DASHBOARD</h1>
      <div className="upperCards">
        <NavLink to="/flashcardPage">
          <FlashCardDashboard />
        </NavLink>
        <NavLink to="/userStatusPage">
          <UserStatusDashboard
            imagemPerfil="/"
            porcentagem={50}
            nivel={2}
            tempoDeEstudo={120}
            numeroDeRespostasCertas={20}
          />
        </NavLink>
      </div>

      <div className="heroCall">
        <h1>Pratique Habilidades</h1>
        <p>
          Selecione uma habilidade e comece a responder questões ganhando
          <strong>XP</strong>
        </p>
      </div>

      <div>
        <NavLink to="/SkillPage">
          <CardSkillsDashboard />
        </NavLink>
      </div>
    </div>
  );
}
