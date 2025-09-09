import React from "react";
import Cardlvl from "../components/Cardlvl";

export default function PraticarPage() {
  return (
    <div>
      <h1>SKILLPAGE</h1>
      <h1>Praticar</h1>

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
