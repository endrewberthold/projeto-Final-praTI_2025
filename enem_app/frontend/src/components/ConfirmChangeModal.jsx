import React from 'react';
import { useEffect, useState } from 'react';
import { GrCheckmark } from "react-icons/gr";
import { RxUpdate } from 'react-icons/rx';
import { TiDelete } from 'react-icons/ti';

import '../styles/components/confirmChangeModal.sass';

const statusId = [
  {
    icon: GrCheckmark,
    id: 'new',
    notification: ' criado com sucesso!',
  },
  {
    icon: RxUpdate,
    id: 'update',
    notification: ' atualizado com sucesso!',
  },
  {
    icon: TiDelete,
    id: 'delete',
    notification: ' excluído com sucesso!',
  },
];

const ConfirmCreateModal = ({ cardTerm, modalId }) => {
  const [statusConfirm, setStatusConfirm] = useState(null);

  useEffect(() => {
    switch (modalId) {
      case 'new':
        setStatusConfirm('new');
        break;
      case 'update':
        setStatusConfirm('update');
        break;
      case 'delete':
        setStatusConfirm('delete');
        break;
    }
  }, [modalId]);

  return (
    <div className="pop-header">
      {statusId.map(({ icon, id, notification }) => {
        const IconComponent = icon;
        return (
          <div className="pop-main" key={id}>
            {statusConfirm === id && (
              <>
                <IconComponent className="pop-icon" />
                <div className="pop-title">
                  {cardTerm && (
                    <h3>
                      Flashcard <strong>{cardTerm}</strong>
                      {statusConfirm === id && `${notification}`}
                    </h3>
                  )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ConfirmCreateModal;
