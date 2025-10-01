import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { RxUpdate } from 'react-icons/rx';

import '../styles/components/Flashcard.sass';

export default function Flashcard({
  term,
  id,
  description,
  area,
  handleDelete,
  handleUpdate,
}) {
  return (
    <div className="flashcards-dashboard">
      <div className="title-container">
        <h3 className="flashcards-dash-title">{term}</h3>
      </div>
      <p className="flashcards-dash-description">{description}</p>
      <p className="flashcards-dash-area">{area}</p>
      <div className="flashcards-dash-buttons">
        <RxUpdate
          onClick={() => handleUpdate(id)}
          className="flashdash-icons"
        />
        <AiFillDelete
          onClick={() => handleDelete(id)}
          className="flashdash-icons"
        />
      </div>
    </div>
  );
}
