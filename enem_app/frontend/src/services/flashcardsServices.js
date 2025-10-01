import axios from "../api/axios";

const FLASHCARD_URL = "/api/flashcards";

// FETCHS ALL FLASHCARDS FROM SPECIFIC USER ---------------------------------------------------
// Will initially fetch all the users flashcards to display on the page on page load.
export async function fetchFlashcardsAPI(accessToken) {
  const TOKEN = accessToken;

  const response = await axios.get(FLASHCARD_URL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  console.log("FLASHCARDS DATA API: ", response);
  return response;
}

// CREATES NEW FLASHCARD ----------------------------------------------------------------------
export async function newFlashcardAPI(accessToken, term, areaId, description) {
  const TOKEN = accessToken;

  const response = await axios.post(
    FLASHCARD_URL,
    JSON.stringify({ term, areaId, description }),
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

// DELETES A FLASHCARD BY ID -------------------------------------------------------------------
export async function deleteFlashcardAPI(accessToken, item) {
  const TOKEN = accessToken;
  const id = item;

  const response = await axios.delete(`${FLASHCARD_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}

// UPDATE EXISTING FLASHCARD BY IT ID -----------------------------------------------------------
// Here without the try catch
export async function updateFlashcardAPI(
  accessToken,
  id,
  term,
  areaId,
  description
) {
  const TOKEN = accessToken;

  const response = await axios.put(
    `${FLASHCARD_URL}/${id}`,
    JSON.stringify({ term, areaId, description }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}
