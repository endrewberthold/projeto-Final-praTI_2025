import { useState } from 'react';

const types = {
  input: { message: 'Preencha o campo "Título"' },
  select: { message: 'Selecione uma área de conhecimento' },
  textarea: { message: 'Preencha o campo "Descrição"' },
  empty: {
    message:
      'Para criar um Flashcard, preeencha todos os campos do formulário !',
  },
};

const useForm = (type = '') => {
  const [value, setValue] = useState('');
  const [modal, setModal] = useState({
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
      setTimeout(() => setError(null), 3000);
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
    setModal({
      isOpen: true,
      flashcardId: cardId,
      flashcardTerm: cardTerm || '',
      modalId: modalId,
    });
    setTimeout(() => {
      setModal({
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
    setModal,
    handleCardModal,
    modal,
    value,
    error,
  };
};

export default useForm;
