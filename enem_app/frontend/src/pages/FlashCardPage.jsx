import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

import FlashCard from "../components/FlashCard";

// API calls from services
import {
  fetchFlashcardsAPI,
  newFlashcardAPI,
  deleteFlashcardAPI,
  updateFlashcardAPI,
} from "../services/flashcardsServices";

export default function FlashcardPage() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState();
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [pages, setPages] = useState(1);

  // For new Flashcard
  const [term, setTerm] = useState();
  const [areaId, setAreaId] = useState();
  const [description, setDescription] = useState();
  const [id, setId] = useState();
  const [newFlashcard, setNewFlascard] = useState();

  // When the page first load it will first execute the fetch of all the user flashcards here.
  async function handleFetchFlashcards() {
    try {
      const response = await fetchFlashcardsAPI(accessToken);
      setFlashcardsData(response?.data.content);
      setPages(response?.data.totalPages);

      //console.log("FLASHCARDS DATA: ", flashcardsData);
    } catch (err) {
      if (!err?.response) {
        setMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setMessage("Missing");
      } else if (err.response?.status === 401) {
        setMessage("Unauthorized");
      } else {
        setMessage("New Flash card creation failed");
      }
    }
  }

  // For the first time the page loads
  useEffect(() => {
    handleFetchFlashcards();
  }, [newFlashcard]);

  // FOR NEW FLASHCARD --------------------------------------------------------------------------------------------------
  async function handleNewFlashcard(e) {
    e.preventDefault();
    console.log(term);
    console.log(areaId);
    console.log(description);

    try {
      const response = await newFlashcardAPI(
        accessToken,
        term,
        areaId,
        description
      );

      setNewFlascard(response?.data);
    } catch (err) {
      console.log("ERRO: ", err);
    }
    handleClear();
  }

  // DELETE FLASHCARD ----------------------------------------------------------------------------------------------
  // $ Will be refactored in the futere, it does not need a response, only if it display something in the screen
  async function handleDeleteFlashcard(item) {
    //console.log("DELETE: ", item);
    const id = item;
    const DELETECARD_URL = `/api/flashcards/${id}`;

    try {
      const response = await deleteFlashcardAPI(accessToken, item);
      console.log("DELETADO: ", response);
      handleFetchFlashcards();
    } catch (err) {
      console.log("ERRO ON DELETE CARD: ", err);
    }
  }

  // REQUEST UPDATE FLASHCARD ------------------------------------------------------------------------------------------------
  // Will fill the input values with the select card and the id state
  async function handleRequestUpdateFlashcard(item) {
    console.log("UPDATE: ", item);
    //console.log("REQUEST UPDATE: ", updateFlashcard);

    setTerm(item.term);
    setAreaId(item.areaId);
    setDescription(item.description);
    setId(item.id);
  }

  // UPDATE FLASHCARD --------------------------------------------------------------------------------------------
  // Will update the flashcard having it's id.
  async function handleUpdateFlashcard(e) {
    e.preventDefault();
    try {
      const response = await updateFlashcardAPI(
        accessToken,
        id,
        term,
        areaId,
        description
      );
      setNewFlascard(response?.data);
    } catch (err) {
      console.log("ERRO: ", err);
    }
    handleClear();
  }

  // Will clear the input values
  const handleClear = () => {
    setTerm("");
    setDescription("");
  };

  return (
    <div>
      <h1>FlashcardPage</h1>
      {/* FORM FOR FLASHCARD */}
      <div>
        <form>
          <label>Termo</label>
          <input
            type="text"
            onChange={(e) => setTerm(e.target.value)}
            value={term}
            placeholder="Termo"
          />

          <label htmlFor="">Area:</label>
          <select
            name="selectArea"
            id="areaId"
            onChange={(e) => setAreaId(e.target.value)}
          >
            <option>Selecione uma opção</option>
            <option value="LC">Linguagens, Códigos e suas Tecnologias</option>
            {/* These option are not working with the DB yet */}
            {/* $ MUST IMPLEMENT - const of options and map over it*/}
            <option value="CH">Ciências Humanas e suas Tecnologias</option>
            <option value="CN">Ciências da Natureza e suas Tecnologias</option>
            <option value="MT">Matemáticas e suas Tecnologias</option>
          </select>

          <label htmlFor="">Descrição</label>
          <input
            type="text"
            placeholder="Descrição"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          <button onClick={handleClear}>Limpar</button>
          <button onClick={handleUpdateFlashcard}>Atualizar</button>
          <button onClick={handleNewFlashcard}>New Flashcard</button>
        </form>
      </div>

      {/* SECTION TO DISPLAY THE CARDS 20 PER PAGE */}
      {/* $ MUST IMPLEMENT PAGINATION - will update the 'page' api request above 'handleFetchFlashcards' and 'pages' state */}
      <div>
        <section>
          {flashcardsData ? (
            <div>
              {flashcardsData.map((item) => (
                <FlashCard
                  key={item.id}
                  id={item.id}
                  term={item.term}
                  description={item.description}
                  area={item.areaId}
                  handleDelete={handleDeleteFlashcard}
                  handleUpdate={() => handleRequestUpdateFlashcard(item)}
                />
              ))}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </section>
      </div>
    </div>
  );
}
