import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import './styles/select.sass';

const optionValues = [
  { areaId: 'LC', areaName: 'Linguagens, Códigos e suas Tecnologias' },
  { areaId: 'CH', areaName: 'Ciências Humanas e suas Tecnologias' },
  { areaId: 'CN', areaName: 'Ciências da Natureza e suas Tecnologias' },
  { areaId: 'MT', areaName: 'Matemáticas e suas Tecnologias' },
];

const Select = ({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  ...props
}) => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className="select"
        {...props}
      >
        <option className="option" value="" disable="true">
          Selecione uma opção
        </option>
        {optionValues.map((option, i) => {
          const { areaId, areaName } = option;
          return (
            // The value of an option should be a string, not an object literal
            <option key={i} value={areaId}>
              {areaName}
            </option>
          );
        })}
      </select>
      {error && (
        <div className="error-message">
          <FaExclamationCircle className="error-icon" />
          <span className="error-text">{error}</span>
        </div>
      )}
    </>
  );
};

export default Select;
