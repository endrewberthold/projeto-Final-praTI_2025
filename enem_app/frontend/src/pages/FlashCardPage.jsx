import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/pages/flashCardPage.sass";

import useAuth from "../hooks/useAuth";
import FlashCards from "../components/FlashCards";

export default function FlashCardPage() {
  const { auth } = useAuth();
  const token = auth.accessToken;
  const [flashcardData, setFlashcardData] = useState();

  //console.log("FLASHCARD PAGE: ", token);

  async function fetchFalshcards() {
    try {
      const response = await fetch("http://localhost:8080/api/flashcards", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! : ${response.status} `);
      }

      const data = await response.json();

      setFlashcardData(data.content);
      //console.log(data); // will be used for the pagination of falshcards -> 20 per page?
      //console.log(data.content); // data.content is the path to the array of flashcards to display
    } catch (err) {
      console.log("ERROR FETCHING DATA: ", err);
    }
  }

  useEffect(() => {
    fetchFalshcards();
  }, []);

  //console.log("FLASHCARD DATA: ", flashcardData);

  return (
    <div className="container-flashcard">
      <h1>FLASHCARDPAGE</h1>

      {flashcardData ? <FlashCards data={flashcardData} /> : <p>Loading....</p>}
      <div>{/* Conteudo de filtro e novo flashcard */}</div>

      <div>{/* Flashcards em si */}</div>
    </div>
  );
}
