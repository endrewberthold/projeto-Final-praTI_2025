import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  startSessionAPI,
  sendAnswerAPI,
  finishSessionAPI,
} from "../services/SkillsServices";
import useAuth from "../hooks/useAuth";

export default function Answers() {
  const { accessToken } = useAuth();
  const params = useParams();

  const levelId = params.levelId;
  const numQuestions = 5;
  const areaId = params.id;

  const [sessionId, setSessionId] = useState();

  const [questions, setQuestions] = useState({});
  const [start, setStart] = useState(false);

  const [selectedAnswer, setSelectedAnswer] = useState("");

  //console.log("ANSWERS: ", levelId);

  // START the questions session, will take 5 questions and answers
  async function handleStart(e) {
    e.preventDefault();
    try {
      const response = await startSessionAPI(
        accessToken,
        levelId,
        numQuestions,
        areaId
      );
      console.log("SESSION START: ", response.data);

      setQuestions(response.data.questions);
      setSessionId(response.data.sessionId);
      console.log(response.data.sessionId);

      setStart(true);
      console.log(questions);
    } catch (err) {
      console.log("ERROR WHILE FETCHING START SESION API: ", err);
    }
  }

  // Will send the answar for each question
  async function handleAnswer(e, questionId, answerTimeMs) {
    e.preventDefault();
    console.log("Trying to finish question");
    console.log(questionId);
    console.log(selectedAnswer);
    console.log(answerTimeMs);

    try {
      const response = await sendAnswerAPI(
        accessToken,
        sessionId,
        questionId,
        levelId,
        selectedAnswer,
        1500
      );
      console.log(response);
    } catch (err) {
      console.log("ERROR WHILE SENDING ANSWER: ", err);
    }
  }

  // Will finish the hole session, when all questions are finish
  async function handleFinish(e) {
    e.preventDefault();

    console.log("Trying to finish session");
    console.log(sessionId);

    try {
      const response = await finishSessionAPI(accessToken, sessionId);
      console.log("AQUI", sessionId);
      setStart(false);
      console.log(response);
    } catch (err) {
      console.log("ERROR WHILE FINISHING SESSION: ", err);
    }
  }

  useEffect(() => {
    console.log("UPDATED");
    console.log(questions);
  }, [questions]);

  function handleChange(e) {
    setSelectedAnswer(e.target.value);
  }
  // Make a new component for each question?
  // The 'Finalizar' button must be in the end not in every question!
  return (
    <div>
      Message before starting the session
      <button onClick={handleStart}>Começar</button>
      {start == true ? (
        questions.map((item) => (
          <div>
            <form>
              <h1>{item.text}</h1>
              <ul>
                <li>
                  <input
                    type="radio"
                    name="answer"
                    value="a1"
                    checked={selectedAnswer === "a1"}
                    onChange={handleChange}
                  />
                  <p>{item.alternatives[0].text}</p>
                </li>

                <li>
                  <input
                    type="radio"
                    name="answer"
                    value="a2"
                    checked={selectedAnswer === "a2"}
                    onChange={handleChange}
                  />
                  <p>{item.alternatives[1].text}</p>
                </li>

                <li>
                  <input
                    type="radio"
                    name="answer"
                    value="a3"
                    checked={selectedAnswer === "a3"}
                    onChange={handleChange}
                  />
                  <p>{item.alternatives[2].text}</p>
                </li>

                <li>
                  <input
                    type="radio"
                    name="answer"
                    value="a4"
                    checked={selectedAnswer === "a4"}
                    onChange={handleChange}
                  />
                  <p>{item.alternatives[3].text}</p>
                </li>

                <li>
                  <input
                    type="radio"
                    name="answer"
                    value="a5"
                    checked={selectedAnswer === "a5"}
                    onChange={handleChange}
                  />
                  <p>{item.alternatives[4].text}</p>
                </li>
              </ul>

              <button //onClick={handleAnswer(item.alternatives.presentedId)}
                onClick={(e) => handleAnswer(e, item.questionId, 1500)}
              >
                Responder
              </button>
            </form>
            <button onClick={handleFinish}>Finalizar</button>
          </div>
        ))
      ) : (
        <p>começar</p>
      )}
    </div>
  );
}

// #  COPY  #
// return (
//     <div>
//       Message before starting the session
//       <button onClick={handleStart}>Começar</button>
//       {start == true ? (
//         questions.map((item) => (
//           <div>
//             <form>
//               <h1>{item.text}</h1>
//               <ul>
//                 <li>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value="a1"
//                     checked={selectedAnswer === "a1"}
//                     onChange={handleChange}
//                   />
//                   <p>{item.alternatives[0].text}</p>
//                 </li>

//                 <li>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value="a2"
//                     checked={selectedAnswer === "a2"}
//                     onChange={handleChange}
//                   />
//                   <p>{item.alternatives[1].text}</p>
//                 </li>

//                 <li>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value="a3"
//                     checked={selectedAnswer === "a3"}
//                     onChange={handleChange}
//                   />
//                   <p>{item.alternatives[2].text}</p>
//                 </li>

//                 <li>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value="a4"
//                     checked={selectedAnswer === "a4"}
//                     onChange={handleChange}
//                   />
//                   <p>{item.alternatives[3].text}</p>
//                 </li>

//                 <li>
//                   <input
//                     type="radio"
//                     name="answer"
//                     value="a5"
//                     checked={selectedAnswer === "a5"}
//                     onChange={handleChange}
//                   />
//                   <p>{item.alternatives[4].text}</p>
//                 </li>
//               </ul>

//               <button //onClick={handleAnswer(item.alternatives.presentedId)}
//                 onClick={(e) => handleAnswer(e, item.questionId, 1500)}
//               >
//                 Responder
//               </button>
//             </form>
//           </div>
//         ))
//       ) : (
//         <p>começar</p>
//       )}
//     </div>
//   );
