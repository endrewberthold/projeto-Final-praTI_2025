import React from "react";
import Cardlvl from "../components/Cardlvl";
export default function SkillPage() {
  return (
    <div>
      <h1>SkillPage</h1>

      <Cardlvl
        titulo="lvl 001"
        totalQuestoes={10}
        respondidas={0}
        textoBotao="Começar"
        onClick={() => alert("Iniciando nível 1")} //esse botão pode ser alterado
      />
    </div>
  );
}
