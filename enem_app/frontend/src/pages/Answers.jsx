import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  startSessionAPI,
  sendAnswerAPI,
  finishSessionAPI,
} from "../services/SkillsServices";
import useAuth from "../hooks/useAuth";
import QuestionPage from "./QuestionPage.jsx";
import AbandonSessionModal from "../components/AbandonSessionModal.jsx";
import "../styles/pages/questionPage.sass";

export default function Answers() {
  const { accessToken } = useAuth();
  const params = useParams();
  const navigate = useNavigate();

  const levelId = params.levelId;
  const numQuestions = 5;
  const areaId = params.id;

  const [sessionId, setSessionId] = useState();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [started, setStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [abandonModal, setAbandonModal] = useState({ isOpen: false });

  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null); // guarda o intervalo ativo
  const sessionStartRef = useRef(null); // guarda o tempo inicial

  const [toggleSkill, setToggleSkill] = useState(false);

  // Inicia sessão
  async function handleStart(e) {
    e.preventDefault();
    setToggleSkill(false);

    try {
      const response = await startSessionAPI(
        accessToken,
        levelId,
        numQuestions,
        areaId
      );

      setQuestions(response.data.questions || []);
      setSessionId(response.data.sessionId);
      setStarted(true);
      setCurrentIndex(0);
      setSelectedAnswer(null);

      sessionStartRef.current = Date.now();

      //! LOOP de atualziaão do componente completo. Precisa mudar o cronometro para componente separado
      intervalRef.current = setInterval(() => {
        setElapsedTime(Date.now() - sessionStartRef.current);
      });
    } catch (err) {
      console.log("Erro ao iniciar a sessão: ", err);
    }
  }

  //console.log("startSessionAPI: ", questions);

  // Envia resposta e avança
  async function handleAnswer() {
    setToggleSkill(false);
    const question = questions[currentIndex];

    if (!selectedAnswer) {
      setErrorMessage("Selecione uma alternativa!");
      return;
    }

    console.log("TOGGLE", toggleSkill);

    try {
      await sendAnswerAPI(
        accessToken,
        sessionId,
        question.questionId,
        levelId,
        selectedAnswer
      );

      // =========== TESTE DE ENVIO RESPOSTAS ==============
      console.log("Enviando resposta:", selectedAnswer);

      const nextIndex = currentIndex + 1;

      if (nextIndex < questions.length) {
        setCurrentIndex(nextIndex);
        setSelectedAnswer(null);
      } else {
        const finishResponse = await finishSessionAPI(accessToken, sessionId);

        // =========== TESTE RECEBIMENTO RESPOSTA BACKEND ===============
        console.log("Resposta do finishSessionAPI:", finishResponse.data);

        clearInterval(intervalRef.current);
        const totalSessionTime = Date.now() - sessionStartRef.current;

        navigate(`/skillPage/${areaId}/feedback/${sessionId}`, {
          state: {
            totalTime: totalSessionTime,
            levelCompleted: finishResponse.data.levelCompleted,
            correct: finishResponse.data.correct,
            wrong: finishResponse.data.wrong,
            xpEarned: finishResponse.data.xpEarned,
            totalQuestions: finishResponse.data.totalQuestions,
            levelId,
          },
        });
      }
    } catch (err) {
      console.error(
        "Erro ao enviar:",
        err.response?.status,
        err.response?.data
      );
    }
  }

  // Limpa o cronômetro
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const currentQuestion = questions[currentIndex];

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")} m : ${seconds
      .toString()
      .padStart(2, "0")} s`;
  }

  function abandonSession() {
    setAbandonModal({
      isOpen: true,
    });
  }

  function handleBack() {
    navigate(`/skillPage/${areaId}`);
  }

  if (!started)
    return (
      <div className="start-screen">
        <img
          id="start-image"
          src="/Questions/quiz-image.svg"
          alt="Imagem feedback negativo"
        />
        <h3 className="start-title">Bem-vindo!</h3>
        <p className="start-text">Clique abaixo para começar o quiz.</p>

        <button className="start-btn" onClick={handleStart}>
          Começar
        </button>
      </div>
    );

  return (
    <div className="question-screen">
      <QuestionPage
        toggleSkill={toggleSkill}
        setToggleSkill={setToggleSkill}
        question={currentQuestion}
        selected={selectedAnswer}
        onSelect={(_, val) => {
          setSelectedAnswer(val);
          setErrorMessage("");
        }}
        onClick={handleAnswer}
        error={errorMessage}
      >
        <h3 className="question-title">
          Pergunta {currentIndex + 1} de {questions.length}
        </h3>
      </QuestionPage>

      <div className="timer-container">
        <p>
          <strong>Tempo:</strong>
        </p>
        <p>{formatTime(elapsedTime)}</p>
        <p className="questions-map-title">
          <strong>Questões:</strong>
        </p>
        <div className="questions-map">
          {questions.map((question, index) => (
            <button
              key={question.questionId || index}
              className={`question-btn ${
                index === currentIndex ? "selected" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button className="abandon-btn" onClick={abandonSession}>
          Abandonar sessão
        </button>
      </div>

      <AbandonSessionModal
        isOpen={abandonModal.isOpen}
        onConfirm={handleBack}
        onClose={() => setAbandonModal({ isOpen: false })}
        message={"Tem certeza que deseja abandonar a sessão?"}
      />
    </div>
  );
}
