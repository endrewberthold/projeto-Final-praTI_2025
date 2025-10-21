import React from 'react';

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
        <span style={{ color: '#f24d4dcc' }}>Preencha o campo "Descrição"</span>
      )}
    </>
  );
};

export default Textarea;
