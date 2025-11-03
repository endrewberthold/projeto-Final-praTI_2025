import { useEffect, useState } from 'react';
import { GrCheckmark } from 'react-icons/gr';
import { RxUpdate } from 'react-icons/rx';

import '../styles/components/confirmChangeModal.sass';

const ConfirmCreateModal = ({ cardTerm, modalId }) => {
  const [deleteIcon, setDeleteIcon] = useState(false);

  const handleChangeTitle = () => {
    switch (modalId) {
      case 'new':
        return ' criado com sucesso!';
      case 'update':
        return ' atualizado com sucesso!';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (modalId === 'delete') {
      setDeleteIcon(true);
    }
  }, [modalId]);

  useEffect(() => {
    console.log(deleteIcon, modalId);
  }, [deleteIcon]);

  return (
    <div className="pop-header">
      {!deleteIcon ? (
        <FaCheckCircle className="title-icon" />
      ) : (
        <TiDelete className="title-icon" />
      )}
      <div className="pop-title">
        {cardTerm && (
          <h3>
            Flashcard <strong>{cardTerm}</strong>
            {!deleteIcon ? handleChangeTitle() : ' excluído com sucesso!'}
          </h3>
        )}
      </div>
    </div>
  );
};

export default ConfirmCreateModal;
