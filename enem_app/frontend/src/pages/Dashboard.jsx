import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/pages/dashboard.sass";

//import NavBar from "../components/NavBar";
import FlashCardDashboard from "../components/FlashCardDashboard";
import UserStatusDashboard from "../components/UserStatusDashboard";
import CardHabilidadeDashboard from "../components/CardHabilidadeDashboard";
//import { BiMath } from "react-icons/bi";

export default function Dashboard() {
  return (
    <div className="container-dashboard">
      <div className="upperCards">
        <NavLink to="/flashcards">
          <FlashCardDashboard />
        </NavLink>
        <NavLink to="/userStatus">
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
        <NavLink to="/praticar">
          <CardHabilidadeDashboard
            //icone={<BiMath />} erro ao passar assim ou com ''
            titulo={"Titulo"}
            porcentagem={30}
            questoes={200}
            conteudoVerso={true}
          />
        </NavLink>

        <NavLink to="/praticar">
          <CardHabilidadeDashboard
            //icone={<BiMath />} erro ao passar assim ou com ''
            titulo={"Titulo"}
            porcentagem={30}
            questoes={200}
            conteudoVerso={true}
          />
        </NavLink>
      </div>
    </div>
  );
}
