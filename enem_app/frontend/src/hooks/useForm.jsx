import { useState, useEffect } from 'react';

const types = {
  input: { message: 'Preencha o campo "Título"' },
  select: { message: 'Selecione uma área de conhecimento' },
  textarea: { message: 'Preencha o campo "Descrição"' },
};

const useForm = (type = '') => {
  const [value, setValue] = useState('');
  const [cardModal, setCardModal] = useState({
    isOpen: false,
    flashcardId: null,
    flashcardTerm: '',
    modalId: '',
  });

  const [error, setError] = useState(null);

  function validate(value) {
    if (type === false) return true;
    if (!value || value.length === 0) {
      setError(types[type].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  function onChange({ target }) {
    if (error) validate(target.value);
    setValue(target.value);
  }

  //For Modals
  const handleCardModal = (cardId, cardTerm, modalId) => {
    setCardModal({
      isOpen: true,
      flashcardId: cardId,
      flashcardTerm: cardTerm || 'Flashcard',
      modalId: modalId,
    });
  };

  const handleCloseModal = () => {
    setTimeout(() => {
      setCardModal({
        isOpen: false,
        flashcardId: null,
        flashcardTerm: '',
        modalId: '',
      });
    }, 3500);
  };

  return {
    setValue,
    onChange,
    onBlur: () => validate(value),
    validate: () => validate(value),
    setCardModal,
    handleCardModal,
    handleCloseModal,
    cardModal,
    value,
    error,
  };
};

export default useForm;
