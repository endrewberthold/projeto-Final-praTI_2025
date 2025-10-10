import React from 'react';

import '../styles/components/modalForm.sass';

export default function ModalForm({ onClose }) {
  return (
    <div className="modal-form-container">
      <div className="modal-content">
        <p>
          Por favor, verifique se todos os dados do Flashcard foram preenchidos
          corretamente!
        </p>
        <button className="close-modal" onClick={onClose}>
          Fechar
        </button>
      </div>
    </div>
  );
}
