import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../styles/pages/feedbackPage.sass";
import StatCard from "../components/StatCard.jsx";
import {FaChartLine, FaClock, FaTrophy} from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";


export default function FeedbackPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: areaId} = useParams();

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

    //Média de tempo por questão
    const answerTimeAverage = totalTime / totalQuestions

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
            <img
                id="positive-image"
                src="/Questions/well-done-image.svg"
                alt="Imagem feedback positivo"
            />
            <h3 className="feedback-title">Mandou bem!</h3>
            <p className="feedback-text">Você está dominando esse assunto e já pode avançar para o próximo nível.</p>

            <div className="results-container">
                <StatCard
                    icon={<FaClock size={20} />}
                    value={formatTime(totalTime)}
                    label="Tempo da sessão"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaChartLine size={20} />}
                    value={percent + "%"}
                    label="Acertos"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaTrophy size={20} />}
                    value={xpEarned}
                    label="XPs recebidos"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaCircleQuestion size={20} />}
                    value={formatTime(answerTimeAverage)}
                    label="Tempo por questão"
                    className= "results-icon"
                />
            </div>
            <button className="positive-screen-btn" id="btn" onClick={handleBack}>Sair</button>
        </div>
                ) : (
        <div className="negative-feedback-screen">
            <img
                id="negative-image"
                src="/Questions/try-again-image.svg"
                alt="Imagem feedback negativo"
            />
            <h3 className="feedback-title">Poxa, não foi dessa vez...</h3>
            <p className="feedback-text">Continue se esforçando para avançar para o próximo nível.</p>

            <div className="results-container">
                <StatCard
                    icon={<FaClock size={20} />}
                    value={formatTime(totalTime)}
                    label="Tempo da sessão"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaChartLine size={20} />}
                    value={percent + "%"}
                    label="Acertos"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaTrophy size={20} />}
                    value={xpEarned}
                    label="XPs recebidos"
                    className= "results-icon"
                />
                <StatCard
                    icon={<FaCircleQuestion size={20} />}
                    value={formatTime(answerTimeAverage)}
                    label="Tempo por questão"
                    className= "results-icon"
                />
            </div>
            <div className="buttons-container">
            <button className="negative-screen-btn" onClick={handleTryAgain}>Tentar novamente</button>
            <button className="negative-screen-btn" onClick={handleBack}>Sair</button>
            </div>
       </div>
    )};


