import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

import FlashCard from "../components/FlashCard";

const FLASHCARD_URL = "/api/flashcards";
const NEWFLASHCARD_URL = "/api/flashcards";

export default function FlashcardPage() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState();
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [pages, setPages] = useState(1);
  //console.log("ACCESSTOKEN: ", accessToken);

  // For new Flashcard
  const [term, setTerm] = useState();
  const [areaId, setAreaId] = useState();
  const [description, setDescription] = useState();

  const [newFlashcard, setNewFlascard] = useState();

  async function handleFetchFlashcards() {
    try {
      const response = await axios.get(FLASHCARD_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setFlashcardsData(response?.data.content);
      setPages(response?.data.totalPages);

      //console.log("PAGES: ", pages);
      console.log("FLASHCARDS DATA: ", flashcardsData);
      //console.log(JSON.stringify(response));
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

  useEffect(() => {
    handleFetchFlashcards();
  }, [newFlashcard]);

  //   useEffect(() => {
  //     handleFetchFlashcards();
  //   }, [newFlashcard]);

  // FOR NEW FLASHCARD
  async function handleNewFlashcard(e) {
    e.preventDefault();
    console.log(term);
    console.log(areaId);
    console.log(description);

    try {
      const response = await axios.post(
        NEWFLASHCARD_URL,
        JSON.stringify({ term, areaId, description }),
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      setNewFlascard(response?.data);
    } catch (err) {
      console.log("ERRO: ", err);
    }
  }

  async function handleDelete(item) {
    //e.preventDefault();
    console.log("DELETE: ", item);

    const id = item;
    const DELETECARD_URL = `/api/flashcards/${id}`;

    try {
      const response = await axios.delete(DELETECARD_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log("DELETADO: ", response);
      handleFetchFlashcards();
    } catch (err) {
      console.log("ERRO ON DELETE CARD: ", err);
    }
  }

  async function handleUpdate(item) {
    console.log("UPDATE: ", item);
  }

  return (
    <div>
      <h1>FlashcardPage</h1>
      {/* FORM FOR NEW FLASHCARD */}
      <div>
        <form onSubmit={handleNewFlashcard}>
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

          <button>New Flashcard</button>
        </form>
      </div>
      {/* SECTION TO DISPLAY THE CARDS 20 PER PAGE */}
      {/* $ MUST IMPLEMENT PAGINATION $ */}
      <div>
        <section>
          {flashcardsData ? (
            <div>
              {flashcardsData.map((item) => (
                <FlashCard
                  key={item.id}
                  id={item.id}
                  title={item.term}
                  description={item.description}
                  area={item.areaId}
                  handleDelete={handleDelete}
                  handleUpdate={handleUpdate}
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
