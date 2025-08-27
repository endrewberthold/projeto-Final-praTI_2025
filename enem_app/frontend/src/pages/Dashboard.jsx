import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/pages/dashboard.sass";

//import NavBar from "../components/NavBar";
import FlashCardDashboard from "../components/FlashCardDashboard";
import UserStatusDashboard from "../components/UserStatusDashboard";
import SkillCard from "../components/SkillCard"
//import { BiMath } from "react-icons/bi";

export default function Dashboard() {
  const navigate = useNavigate();

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
        {/*Removi o NavLink daqui e troquei por useNavigate*/}
          <SkillCard
            //icone={<BiMath />} erro ao passar assim ou com ''
            titulo={"Titulo"}
            porcentagem={30}
            questoes={200}
            textoBotao="Responder"
            onClick={() => navigate("/praticar")}
            conteudoVerso={["Tema 1", "Tema 2", "Tema 3"]}
          />

      </div>
    </div>
  );
}
