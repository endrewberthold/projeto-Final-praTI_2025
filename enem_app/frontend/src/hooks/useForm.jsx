import { useState } from 'react';

const types = {
  input: { message: 'Preencha o campo "Título"' },
  select: { mesage: 'Selecione uma área de conhecimento' },
  textarea: { mesage: 'Preencha o campo "Descrição"' },
};

const useForm = (type) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(null);

  function validate(value) {
    if (type === false) return true;
    if (value.length === 0) {
      setError(type[types].message);
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

  return {
    setValue,
    onChange,
    onBlur: () => validate(value),
    validate: () => validate(value),
    value,
    error,
  };
};

export default useForm;
