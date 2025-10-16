import React from 'react';

const optionValues = [{ areaId: '', areaName: '' }];

const values = optionValues.map((value, i) => `${value}+${[i + 1]}`);
const areas = optionAreas.map((area, i) => `${area}+${[i + 1]}`);

const Select = ({
  id,
  label,
  name,
  value,
  onChange,
  onBlur,
  optionValues,
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
        {...props}
      >
        <option value0="" disable>
          Selecione uma opção
        </option>
        {optionAreas.map(
          (area, i) => (<option value={area}>{}</option>)`${area}+${[i + 1]}`,
        )}
      </select>
      {error && <span>{error}</span>}
    </>
  );
};

export default Select;
