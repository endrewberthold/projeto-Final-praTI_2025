import { useState } from 'react';
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
  areaName,
  areaId,
  handleDelete,
  handleUpdate,
  isSelectionMode = false,
  isSelected = false,
  onToggleSelection,
  selectedAreaFilter = null, // 'ALL' ou areaId específico (ex: 'CH', 'CN', 'LC', 'MT')
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [hoverMessage, setHoverMessage] = useState('');

  // implementar tooltip para botões flashcard (futuramente)
  // const [tooltipUpdate, setTooltipUpdate] = useState(true);
  // const [tooltipDelete, setTooltipDelete] = useState(false);

  const handleNavigate = (e) => {
    e.preventDefault();
    // Passa o filtro selecionado para manter no ViewFlashCard
    navigate(`/viewFlashPage/${id}`, { 
      state: { 
        term, 
        description, 
        areaName, 
        areaId,
        selectedAreaFilter: selectedAreaFilter || 'ALL' // Passa o filtro selecionado
      } 
    });
  };

  const handleCardClick = (e) => {
    if (isSelectionMode) {
      e.preventDefault();
      onToggleSelection();
    } else {
      // Se não estiver em modo de seleção, navegar para a página de visualização
      handleNavigate(e);
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

      {!isSelectionMode && (
        <div className={`flashcards-dash-buttons ${theme}`}>
          <RxUpdate
            onClick={(e) => {
              e.stopPropagation();
              handleUpdate(id);
            }}
            onMouseEnter={() => setHoverMessage('Clique para atualizar')}
            onMouseLeave={() => setHoverMessage('')}
            className="flashdash-icons"
          />
          <AiFillDelete
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(id);
            }}
            onMouseEnter={() => setHoverMessage('Clique para deletar')}
            onMouseLeave={() => setHoverMessage('')}
            className="flashdash-icons"
          />
        </div>
      )}

      <div className="flashcard-content">
        <div className="title-container">
          <h3 className="flashcards-title">{term}</h3>
        </div>
        {areaName && (
          <div className="area-container">
            <span className="flashcards-area">{areaName}</span>
          </div>
        )}
      </div>

      {!isSelectionMode && (
        <div className="practice-message">
          {hoverMessage || 'Clique para praticar'}
        </div>
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
