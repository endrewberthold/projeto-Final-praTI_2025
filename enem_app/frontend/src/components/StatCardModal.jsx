import React from "react";
import "../styles/components/StatCardModal.sass";
import { FaChartLine, FaClock, FaTrophy } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";

/**
 * Componente Modal que exibe todas as estatísticas e uma barra de progresso
 * @param {Object} props - Propriedades do componente
 * @param {string} props.sessionTime - Tempo da sessão formatado
 * @param {number} props.accuracy - Porcentagem de acertos
 * @param {number} props.xpEarned - XPs recebidos
 * @param {string} props.timePerQuestion - Tempo por questão formatado
 * @param {number} props.progress - Valor de progresso (0-100) para a barra
 * @param {boolean} props.isLocked - Se o card está bloqueado
 * @param {number} props.previousLevelNumber - Número do nível anterior
 */
export default function StatCardModal({
  sessionTime,
  accuracy,
  xpEarned,
  timePerQuestion,
  progress = 0,
  isLocked = false,
  previousLevelNumber = null,
}) {
  if (isLocked) {
    return (
      <div className="stat-card-modal stat-card-modal--locked">
        <div className="stat-card-modal__content stat-card-modal__content--locked">
          <div className="stat-card-modal__locked-message">
            <div className="stat-card-modal__locked-icon">🔒</div>
            <h3 className="stat-card-modal__locked-title">Card Bloqueado</h3>
            <p className="stat-card-modal__locked-text">
              Para desbloquear este card, você precisa acertar <strong>70%</strong> das questões do nível anterior (lvl {previousLevelNumber || 'N'}).
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="stat-card-modal">
      <div className="stat-card-modal__content">
        <div className="stat-card-modal__stats">
          <div className="stat-card-modal__stat-item">
            <div className="stat-card-modal__icon">
              <FaClock size={20} />
            </div>
            <div className="stat-card-modal__stat-content">
              <span className="stat-card-modal__value">{sessionTime}</span>
              <span className="stat-card-modal__label">Tempo da sessão</span>
            </div>
          </div>

          <div className="stat-card-modal__stat-item">
            <div className="stat-card-modal__icon">
              <FaChartLine size={20} />
            </div>
            <div className="stat-card-modal__stat-content">
              <span className="stat-card-modal__value">{accuracy}%</span>
              <span className="stat-card-modal__label">Acertos</span>
            </div>
          </div>

          <div className="stat-card-modal__stat-item">
            <div className="stat-card-modal__icon">
              <FaTrophy size={20} />
            </div>
            <div className="stat-card-modal__stat-content">
              <span className="stat-card-modal__value">{xpEarned}</span>
              <span className="stat-card-modal__label">XPs recebidos</span>
            </div>
          </div>

          <div className="stat-card-modal__stat-item">
            <div className="stat-card-modal__icon">
              <FaCircleQuestion size={20} />
            </div>
            <div className="stat-card-modal__stat-content">
              <span className="stat-card-modal__value">{timePerQuestion}</span>
              <span className="stat-card-modal__label">Tempo por questão</span>
            </div>
          </div>
        </div>

        <div className="stat-card-modal__progress-container">
          <div className="stat-card-modal__progress-label">
            <span>Progresso</span>
            <span className="stat-card-modal__progress-value">{progress}%</span>
          </div>
          <div className="stat-card-modal__progress-bar">
            <div
              className="stat-card-modal__progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

