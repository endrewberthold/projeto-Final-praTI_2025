import React from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';

import '../styles/components/confirmDeleteModal.sass';

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão",
  message = "Tem certeza que deseja excluir este flashcard?",
  itemName = ""
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <FaTrash className="title-icon" />
            <h3>{title}</h3>
          </div>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="modal-body">
          <p className="confirm-message">{message}</p>
          {itemName && (
            <div className="item-info">
              <strong>Flashcard:</strong> {itemName}
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            <FaTrash />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
