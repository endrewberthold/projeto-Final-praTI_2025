// src/components/Praticar.jsx
import React from "react";
import LevelCard from "./LevelCard";
import "../styles/components/levelCard.sass";


 function Praticar() {
  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
        <LevelCard
          titulo="lvl 001"
          totalQuestoes={10}
          respondidas={0}
          textoBotao="Começar"
          onClick={() => alert("Iniciando nível 1")} //esse botão pode ser alterado
        />
    </div>

  );
}

export default Praticar;