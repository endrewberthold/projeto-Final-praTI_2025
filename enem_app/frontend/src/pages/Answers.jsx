import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {
  startSessionAPI,
  sendAnswerAPI,
  finishSessionAPI,
} from "../services/SkillsServices";
import useAuth from "../hooks/useAuth";
import QuestionPage from "./QuestionPage.jsx";
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

  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null); // guarda o intervalo ativo
  const sessionStartRef = useRef(null); // guarda o tempo inicial


  // Inicia sessão
  async function handleStart(e) {
    e.preventDefault();
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
      setCurrentIndex(0)
      setSelectedAnswer(null);

      sessionStartRef.current = Date.now();

      intervalRef.current = setInterval(() => {
          setElapsedTime(Date.now() - sessionStartRef.current);
      });

    } catch (err) {
      console.log("Erro ao iniciar a sessão: ", err);
    }
  }

  // Envia resposta e avança
  async function handleAnswer() {
   const question = questions[currentIndex];
   if(!selectedAnswer) return alert("Selecione uma alternativa!") // precisa arrumar

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
                  levelId
              },
          });
      }

    } catch (err) {
      console.log("Erro ao enviar as respostas: ", err);
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
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

  if (!started)
  return (
      <div className="start-screen">
          <h3>Bem-vindo!</h3>
          <p>Clique abaixo para começar o quiz</p>
          <button className="start-btn" onClick={handleStart}>
              Começar
          </button>
      </div>
      );


  return (
      <div className="question-screen">

           <QuestionPage
           question={currentQuestion}
           selected={selectedAnswer}
           onSelect={(_, val) => setSelectedAnswer(val)}
           onClick={handleAnswer}
       >
          <h3 className="question-title">
              Pergunta {currentIndex + 1} de {questions.length}
          </h3>
       </QuestionPage>

    <div className="timer-container">
        <p>Tempo da sessão</p>
        <p>{formatTime(elapsedTime)}</p>
    </div>
      </div>
  );
}