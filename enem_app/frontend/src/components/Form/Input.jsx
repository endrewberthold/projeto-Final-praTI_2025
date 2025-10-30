import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

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
      {error && (
        <div className="error-message">
          <FaExclamationCircle className="error-icon" />
          <span className="error-text">{error}</span>
        </div>
      )}
    </>
  );
};

export default Input;
