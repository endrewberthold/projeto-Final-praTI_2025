import React from 'react';
import { GrCheckmark } from "react-icons/gr";
import { RxUpdate } from 'react-icons/rx';

import '../styles/components/confirmChangeModal.sass';

const ConfirmCreateModal = ({ cardTerm, modalId }) => {
  const variant = modalId === 'new' ? 'success' : 'info';
  const Icon = modalId === 'new' ? GrCheckmark : RxUpdate;
  return (
    <div className={`pop-header ${variant}`}>
      <Icon className="title-icon" color={modalId === 'new' ? '#1ebd80' : 'var(--accent-primary)'} />
      <div className="pop-title">
        {cardTerm && (
          <h3>
            Flashcard <strong>{cardTerm}</strong>
            {modalId == 'new'
              ? ' criado com sucesso!'
              : ' atualizado com sucesso!'}
          </h3>
        )}
      </div>
    </div>
  );
};

export default ConfirmCreateModal;
