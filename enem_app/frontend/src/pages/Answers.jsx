import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
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
        return `${minutes.toString().padStart(2, "0")} m : ${seconds
            .toString().padStart(2, "0")} s`;
    }

    //Navega de volta para a tela de níveis
    function handleBack() {
        navigate(`/skillPage/${areaId}`);
    }

  if (!started)
  return (
      <div className="start-screen">
          <button className="back-button" onClick={handleBack}>
              <FaArrowLeft size={16} />
              Voltar tela anterior
          </button>
          <img
              id="start-image"
              src="/Questions/quiz-image.svg"
              alt="Imagem feedback negativo"
          />
          <h3 className="start-title">Pronto para o desafio?</h3>
          <p>Teste seus conhecimentos e mostre seu potencial!</p>

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
        <p><strong>Tempo:</strong></p>
        <p>{formatTime(elapsedTime)}</p>
        <p className="questions-map-title"><strong>Questões:</strong></p>
        <div className="questions-map">
            {questions.map((question, index) => <button className={`question-btn ${index === currentIndex ? "selected" : ""}`} onClick={() =>setCurrentIndex(index)}>{index + 1}</button>)}
        </div>
        <button className="abandon-btn" onClick={handleBack}>← Abandonar sessão</button>
    </div>
    </div>
  );
}