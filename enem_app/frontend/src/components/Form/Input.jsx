import React from 'react';

const Input = ({
  id,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  ...props
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        {...props}
      />
      {error && <span>{error}</span>}
    </>
  );
};

export default Input;
