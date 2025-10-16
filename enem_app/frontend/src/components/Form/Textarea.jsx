import React from 'react';

const Textarea = ({
  id,
  label,
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
      {error && <span>{error}</span>}
    </>
  );
};

export default Textarea;
