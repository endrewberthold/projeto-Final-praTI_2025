import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

import '../styles/components/confirmChangeModal.sass';

const ConfirmCreateModal = ({ cardTerm, modalId }) => {
  return (
    <div className="pop-header">
      <FaCheckCircle className="title-icon" />
      <div className="pop-title">
        {cardTerm && (
          <h3>
            Flashcard <strong>{cardTerm}</strong>
            {modalId == 'new' ? ' criado !' : ' atualizado !'}
          </h3>
        )}
      </div>
    </div>
  );
};

export default ConfirmCreateModal;
