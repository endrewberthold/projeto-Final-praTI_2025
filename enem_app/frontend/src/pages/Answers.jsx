import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { startSessionAPI, sendAnswerAPI } from "../services/SkillsServices";
import useAuth from "../hooks/useAuth";

export default function Answers() {
  const { accessToken } = useAuth();
  const params = useParams();

  const levelId = params.levelId;
  const numQuestions = 5;
  const areaId = params.id;

  const [questions, setQuestions] = useState({});
  const [start, setStart] = useState(false);

  //
  const [selectedAnswer, setSelectedAnswer] = useState("");

  //console.log(areaId);
  console.log("ANSWERS: ", levelId);

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
      setStart(true);
      console.log(questions);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAnswer(e, questionId, answerTimeMs) {
    e.preventDefault();
    console.log("Trying to finish question");
    console.log(questionId);
    console.log(selectedAnswer);
    console.log(answerTimeMs);

    try {
      const response = await sendAnswerAPI(
        accessToken,
        questionId,
        levelId,
        selectedAnswer,
        1500
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    console.log("UPDATED");
    console.log(questions);
  }, [questions]);

  function handleChange(e) {
    setSelectedAnswer(e.target.value);
    //console.log("HANDLE", selectedAnswer);
  }

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
          </div>
        ))
      ) : (
        <p>começar</p>
      )}
    </div>
  );
}
