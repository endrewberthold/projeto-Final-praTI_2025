import React, {useState, useEffect, useRef} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { FaArrowLeft, FaSignOutAlt, FaTimes } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import {
  startSessionAPI,
  sendAnswerAPI,
  finishSessionAPI,
} from "../services/SkillsServices";
import useAuth from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import QuestionPage from "./QuestionPage.jsx";
import ConfirmFinishSessionModal from "../components/ConfirmFinishSessionModal.jsx";
import CustomAlert from "../components/CustomAlert.jsx";
import "../styles/pages/questionPage.sass";

export default function Answers() {
  const { accessToken } = useAuth();
  const { toggleTheme, isDark } = useTheme();
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
  const [abandonModal, setAbandonModal] = useState({ isOpen: false });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
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
      setShowAlert(true);
      return;
    }

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

    //Mostra modal de confirmação para finalizar sessão
    function handleAbandonClick() {
        setShowConfirmModal(true);
    }

    //Confirma finalização da sessão
    function handleConfirmFinish() {
        setShowConfirmModal(false);
        clearInterval(intervalRef.current);
        navigate(`/skillPage/${areaId}`);
    }

    //Cancela finalização da sessão
    function handleCancelFinish() {
        setShowConfirmModal(false);
    }

    //Fecha o alerta
    function handleCloseAlert() {
        setShowAlert(false);
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
    <>
      <div className="question-screen">
        <QuestionPage
          toggleSkill={toggleSkill}
          setToggleSkill={setToggleSkill}
          question={currentQuestion}
          selected={selectedAnswer}
          onSelect={(_, val) => {
            setSelectedAnswer(val);
          }}
          onClick={handleAnswer}
        >
          <div className="question-title-container">
            <h3 className="question-title">
              Questão {currentIndex + 1}
            </h3>
            <hr />
          </div>
        </QuestionPage>

        <div className="sidebar-container">
          <div className="timer-container">
            <div className="timer-theme-toggle">
              <div className="button">
                <label
                  htmlFor="themeToggleAnswer"
                  className="themeToggle st-sunMoonThemeToggleBtn"
                  aria-hidden="true"
                >
                  <input
                    type="checkbox"
                    id="themeToggleAnswer"
                    className="themeToggleInput"
                    aria-label="Alternar tema"
                    checked={isDark}
                    onChange={toggleTheme}
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="none"
                  >
                    <mask id="moon-mask-answer">
                      <rect x="0" y="0" width="20" height="20" fill="white"></rect>
                      <circle cx="11" cy="3" r="8" fill="black"></circle>
                    </mask>
                    <circle
                      className="sunMoon"
                      cx="10"
                      cy="10"
                      r="8"
                      mask="url(#moon-mask-answer)"
                    ></circle>
                    <g>
                      <circle className="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
                      <circle className="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
                      <circle className="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
                      <circle className="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
                      <circle className="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
                      <circle className="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
                    </g>
                  </svg>
                </label>
              </div>
            </div>
            <p><strong>Tempo:</strong></p>
            <p className="timer-display">{formatTime(elapsedTime)}</p>
            <p className="questions-map-title"><strong>Questões:</strong></p>
            <div className="questions-map">
              {questions.map((question, index) => (
                <button
                  key={question.questionId || index}
                  className={`question-btn ${
                    index === currentIndex ? "selected" : ""
                  }`}
                  disabled
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button className="abandon-btn" onClick={handleAbandonClick}>
              <FaSignOutAlt size={16} />
              Finalizar Sessão
            </button>
          </div>

          {!toggleSkill ? (
            <div className="skill-container-closed">
              <button className="skill-toggle-btn" onClick={() => setToggleSkill(true)}>
                <LuBrain size={18} />
                <span>Qual habilidade é necessária?</span>
              </button>
            </div>
          ) : (
            <div className="skill-container-open">
              <div className="skill-header">
                <h4>
                  <LuBrain size={18} />
                  Habilidade Necessária
                </h4>
                <button className="skill-close-btn" onClick={() => setToggleSkill(false)}>
                  <FaTimes size={16} />
                </button>
              </div>
              <p className="skill-description">{currentQuestion?.skillDescription}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmFinishSessionModal
        isOpen={showConfirmModal}
        onClose={handleCancelFinish}
        onConfirm={handleConfirmFinish}
        title="Finalizar Sessão"
        message="Tem certeza que deseja finalizar a sessão atual?"
        additionalInfo="Todo o progresso não salvo será perdido."
      />

      <CustomAlert
        isOpen={showAlert}
        onClose={handleCloseAlert}
        title="Atenção"
        message="Selecione uma alternativa antes de continuar!"
        type="warning"
      />
    </>
  );
}
