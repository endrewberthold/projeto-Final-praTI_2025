import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/pages/feedbackPage.sass";

export default function FeedbackPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: areaId} = useParams();

    // const results = location.state?.results || [];
    // const totalTime = location.state?.totalTime || 0;

    const {
        levelId,
        correct = 0,
        totalQuestions = 5,
        xpEarned = 0,
        levelCompleted = false,
        totalTime = 0,
    } = location.state || {};

    //Calcula porcentagem de acertos
    const percent = totalQuestions ? Math.floor((correct / totalQuestions) * 100) : 0;

    //Formata tempo total da sessão
    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    //Navega de volta para a tela de níveis
    function handleBack() {
        navigate(`/skillPage/${areaId}`);
    }

    //Navega para nova tentativa no mesmo nível
    function handleTryAgain() {
        navigate(`/skillPage/${areaId}/answer/${levelId}`);
    }

    return levelCompleted ? (
        <div className="positive-feedback-screen">
            <img/>
            <h3 className="feedback-title">Mandou bem!</h3>
            <p>Você está dominando esse assunto e já pode avançar para o próximo nível</p>

            <div className="feedback-results">
                <div>
                    <p>Desempenho</p>
                    <p>{percent}%</p>
                </div>

                <div>
                    <p>XP Ganho</p>
                    <p>{xpEarned}</p>
                </div>

                <div>
                    <p>Tempo da sessão</p>
                    <p>{formatTime(totalTime)}</p>
                </div>
            </div>
            <button className="return-btn" onClick={handleBack}>Sair</button>
        </div>
                ) : (
        <div className="negative-feedback-screen">
            <img/>
            <h3 className="feedback-title">Poxa, não foi dessa vez...</h3>
            <p>Continue se esforçando para avançar para o próximo nível</p>

            <div className="feedback-results">
                <div>
                    <p>Desempenho</p>
                    <p>{percent}%</p>
                </div>

                <div>
                    <p>XP Ganho</p>
                    <p>{xpEarned}</p>
                </div>

                <div>
                    <p>Tempo da sessão</p>
                    <p>{formatTime(totalTime)}</p>
                </div>
            </div>
            <div className="buttons-container">
            <button className="try-again-btn" onClick={handleTryAgain}>Tentar novamente</button>
            <button className="return-btn" onClick={handleBack}>Sair</button>
            </div>
       </div>
    )};


