import React from "react";
import NavBar from "../components/NavBar";
import "../styles/pages/flashCardPage.sass";

export default function FlashCardPage() {
  return (
    <div className="container-flashcard">
      <h1>FLASHCARDPAGE</h1>
      {/* <div>
        <NavBar />
      </div> */}

      <div>{/* Conteudo de filtro e novo flashcard */}</div>

      <div>{/* Flashcards em si */}</div>
    </div>
  );
}
