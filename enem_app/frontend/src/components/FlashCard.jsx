import React from "react";

export default function Flashcard({
  term,
  id,
  description,
  area,
  handleDelete,
  handleUpdate,
}) {
  return (
    <div>
      <h3>{term}</h3>
      <p>{description}</p>
      <p>{area}</p>
      <button onClick={() => handleDelete(id)}>Deletar</button>
      <button onClick={() => handleUpdate(id)}>Update</button>
    </div>
  );
}
