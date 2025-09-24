import axios from "../api/axios";

const START_SESSIONS_URL = "/api/sessions/start";

export async function startSessionAPI(
  accessToken,
  levelId,
  numQuestions,
  areaId
) {
  const response = await axios.post(
    START_SESSIONS_URL,
    JSON.stringify({ levelId, numQuestions, areaId }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  //console.log("STARTSESSION API: ", response);
  return response;
}

// FOR SUBMITING ANSWER ------------------------------------------------------
export async function sendAnswerAPI(
  accessToken,
  questionId,
  levelId,
  presentedId,
  answerTimeMs
) {
  const SEND_ANSWER_URL = `/api/sessions/${levelId}/attempts`;

  const response = await axios.post(
    SEND_ANSWER_URL,
    JSON.stringify({ accessToken, questionId, presentedId, answerTimeMs }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}

// FOR FINISH SESSION ---------------------------------------------------------
