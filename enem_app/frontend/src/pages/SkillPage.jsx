import React, { useEffect, useState } from "react";
import Cardlvl from "../components/Cardlvl";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

//import { startSessionAPI } from "../services/SkillsServices";

export default function SkillPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const areaId = params.id;

  console.log(areaId);

  //const [levelId, setLevelId] = useState(0);

  function handleNavigate(e, number) {
    e.preventDefault();

    navigate(`./answer/${number}`, { state: { levelId: number } });
  }

  return (
    <div>
      <h1>SkillPage</h1>

      <Cardlvl
        titulo="lvl 001"
        totalQuestoes={5}
        respondidas={0}
        textoBotao="Começar"
        onClick={(e) => handleNavigate(e, 1)}
        //onClick={() => alert("Iniciando nível 1")} //esse botão pode ser alterado
      />

      <Cardlvl
        titulo="lvl 002"
        totalQuestoes={5}
        respondidas={0}
        textoBotao="Começar"
        onClick={(e) => handleNavigate(e, 2)}
        //onClick={() => alert("Iniciando nível 1")} //esse botão pode ser alterado
      />

      <Cardlvl
        titulo="lvl 002"
        totalQuestoes={5}
        respondidas={0}
        textoBotao="Começar"
        onClick={(e) => handleNavigate(e, 3)}
        //onClick={() => alert("Iniciando nível 1")} //esse botão pode ser alterado
      />
    </div>
  );
}
