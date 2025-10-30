import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Textarea = ({
  id,
  label,
  name,
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
      <textarea
        name={name}
        id={id}
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

export default Textarea;
