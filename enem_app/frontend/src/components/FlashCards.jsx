import React from "react";
import { MdBookmarkBorder } from "react-icons/md";
import "../styles/components/flashcards-estatico.sass"


export default function FlashCards() {
  return (
    <div id="flash-principal">
        <MdBookmarkBorder size={50} className="icon"/>
              
        <h1>Flashcards</h1>
            
        <p>Memorize os conteúdos e conceitos com os quais você tem mais dificuldade.</p>
              
        <p id="descricao-quantidade-cards">Você possui 12 cards</p>
    </div>
  )
}