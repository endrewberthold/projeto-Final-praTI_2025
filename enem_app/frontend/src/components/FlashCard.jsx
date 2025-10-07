import React from 'react';

import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

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
  const { theme } = useTheme();

  const navigate = useNavigate();

  const handleNavigate = (e, term, description, area) => {
    e.preventDefault();
    navigate(`/viewFlashPage/${id}`, { state: { term, description, area } });
  };

  return (
    <div className={`flashcards-dashboard ${theme}`}>
      <p className="flashcards-dash-area">{area}</p>
      <div className="flashcard-inner-container">
        <div className="title-container">
          <h3 className="flashcards-dash-title">{term}</h3>
        </div>
      </div>
      <div className={`flashcards-dash-buttons ${theme}`}>
        <RxUpdate
          onClick={() => handleUpdate(id)}
          className="flashdash-icons"
        />
        <AiFillDelete
          onClick={() => handleDelete(id)}
          className="flashdash-icons"
        />
      </div>
      <button onClick={(e) => handleNavigate(e, term, description, area)}>
        abrir
      </button>
    </div>
  );
}

// return (
//   <NavLink to={`/viewFlashPage/${idd}`}>
//     <div className={`flashcards-dashboard ${theme}`}>
//       <p className="flashcards-dash-area">{area}</p>
//       <div className="flashcard-inner-container">
//         <div className="title-container">
//           <h3 className="flashcards-dash-title">{term}</h3>
//         </div>
//       </div>
//       <div className={`flashcards-dash-buttons ${theme}`}>
//         <RxUpdate
//           onClick={() => handleUpdate(id)}
//           className="flashdash-icons"
//         />
//         <AiFillDelete
//           onClick={() => handleDelete(id)}
//           className="flashdash-icons"
//         />
//       </div>
//     </div>
//   </NavLink>
// );
