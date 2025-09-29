import React from "react";
import { PiCards } from "react-icons/pi";
import "../styles/components/flashcardDashboard.sass";

export default function FlashCards() {
  return (
    <div id="flash-principal">
        < PiCards color="#fff" size={"2rem"}/>
        <h1>Flashcards</h1>
    </div>
  );
}
