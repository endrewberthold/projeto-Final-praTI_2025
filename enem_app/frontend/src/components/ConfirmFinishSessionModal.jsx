import React from 'react';
import { FaSignOutAlt, FaTimes } from 'react-icons/fa';

import '../styles/components/confirmFinishSessionModal.sass';

export default function ConfirmFinishSessionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Finalizar Sessão",
  message = "Tem certeza que deseja finalizar a sessão atual?",
  additionalInfo = "Todo o progresso não salvo será perdido."
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-finish-session-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FaSignOutAlt className="title-icon" />
            <h3>{title}</h3>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
          {additionalInfo && (
            <div className="warning-info">
              <strong>⚠️ Atenção:</strong> {additionalInfo}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Continuar Sessão
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            <FaSignOutAlt />
            Finalizar Sessão
          </button>
        </div>
      </div>
    </div>
  );
}
