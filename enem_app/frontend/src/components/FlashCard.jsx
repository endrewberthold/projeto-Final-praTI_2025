import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

import { AiFillDelete } from 'react-icons/ai';
import { RxUpdate } from 'react-icons/rx';
import { FaCheck } from 'react-icons/fa';

import '../styles/components/Flashcard.sass';

export default function Flashcard({
  id,
  term,
  description,
  // areaName,
  areaId,
  handleDelete,
  handleUpdate,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // implementar tooltip para botões flashcard (futuramente)
  // const [tooltipUpdate, setTooltipUpdate] = useState(true);
  // const [tooltipDelete, setTooltipDelete] = useState(false);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/viewFlashPage/${id}`, { state: { term, description, areaId } });
  };

  const handleCardClick = (e) => {
    if (isSelectionMode) {
      e.preventDefault();
      onToggleSelection();
    }
  };

  return (
    <div
      className={`flashcards-dashboard ${theme} ${
        isSelectionMode ? 'selection-mode' : ''
      } ${isSelected ? 'selected' : ''}`}
      onClick={handleCardClick}
    >
      {isSelectionMode && (
        <div className="selection-checkbox">
          <div className={`checkbox ${isSelected ? 'checked' : ''}`}>
            {isSelected && <FaCheck />}
          </div>
        </div>
      )}

      <div className="flashcard-inner-container">
        <div className="title-container">
          <h3 className="flashcards-title">{term}</h3>
        </div>
      </div>

      {!isSelectionMode && (
        <>
          <div className={`flashcards-dash-buttons ${theme}`}>
            <RxUpdate
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(id);
              }}
              className="flashdash-icons"
            />
            <AiFillDelete
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(id);
              }}
              className="flashdash-icons"
            />
          </div>
          <button onClick={handleNavigate}>abrir</button>
        </>
      )}
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
