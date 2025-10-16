import React from 'react';

const useForm = (type, message) => {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);

  function validate(value) {
    if (type === false) return true;
    if (value.length === 0) {
      setError(message);
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

//implementaçõa futura
// else if
// (types[type] && !types[type].regex.test(value)) {
//   setError(types[type].message);
//   return false;
//}
