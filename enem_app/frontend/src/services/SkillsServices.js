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
  sessionId,
  questionId,
  levelId,
  presentedId,
  answerTimeMs
) {
  //const SEND_ANSWER_URL = `/api/sessions/${levelId}/attempts`;
  const SEND_ANSWER_URL = `/api/sessions/${sessionId}/attempts`;

  const response = await axios.post(
    SEND_ANSWER_URL,
    JSON.stringify({ questionId, presentedId, answerTimeMs }),
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

export async function finishSessionAPI(accessToken, sessionId) {
  const FINISH_SESSION_URL = `/api/sessions/${sessionId}/finish`;

  const response = await axios.post(
    FINISH_SESSION_URL,
    JSON.stringify({ accessToken }),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}
