import React, { useEffect, useState } from "react";
import Cardlvl from "../components/Cardlvl";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { FaTrophy } from "react-icons/fa";
import "../styles/pages/skillPage.sass";

//import { startSessionAPI } from "../services/SkillsServices";

export default function SkillPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const areaId = params.id;

  console.log(areaId);

  //const [levelId, setLevelId] = useState(0);

  function handleNavigate(e, levelId) {
    e.preventDefault();
    navigate(`/skillPage/${areaId}/answer/${levelId}`);
  }

  return (
    <div className="skill-page">

      <div className="skill-page-content">
        <h1>SkillPage</h1>

        <div className="pyramid-container">
          {/* Primeira linha - 3 cards */}
          <div className="pyramid-row first-row">
            <Cardlvl
              titulo="lvl 001"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 1)}
            />
            <Cardlvl
              titulo="lvl 002"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 2)}
            />
            <Cardlvl
              titulo="lvl 003"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 3)}
            />
          </div>

          {/* Segunda linha - 2 cards */}
          <div className="pyramid-row second-row">
            <Cardlvl
              titulo="lvl 004"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 4)}
            />
            <Cardlvl
              titulo="lvl 005"
              totalQuestoes={5}
              respondidas={0}
              textoBotao="Começar"
              onClick={(e) => handleNavigate(e, 5)}
            />
          </div>

          {/* Troféu no final da pirâmide */}
          <div className="trophy-container">
            <FaTrophy className="trophy-icon" />
          </div>
        </div>

      </div>

    </div>
  );
}
