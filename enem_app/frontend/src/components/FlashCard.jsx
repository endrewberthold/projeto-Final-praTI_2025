import { useEffect } from 'react';

import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

import { AiFillDelete } from 'react-icons/ai';
import { TiPencil } from 'react-icons/ti';

import '../styles/components/Flashcard.sass';

export default function Flashcard({
  term,
  id,
  description,
  areaId,
  areaName,
  handleDelete,
  handleUpdate,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // implementar tooltip para botões flashcard (futuramente)
  // const [tooltipUpdate, setTooltipUpdate] = useState(true);
  // const [tooltipDelete, setTooltipDelete] = useState(false);

  // PATY: OLHAR AQUI
  // useEffect(() => console.log(areaName), [areaName]);
  // useEffect(() => console.log(areaId), [areaId]);

  const handleNavigate = (e) => {
    e.preventDefault();
    navigate(`/viewFlashPage/${id}`, {
      state: { term, description, areaName },
    });
  };

  return (
    <>
      <div
        className={`flashcards-dashboard ${theme}`}
        onClick={handleNavigate}
        title="Abrir Flashcard"
      >
        <p className="flashcards-dash-area">{areaName}</p>
        <div className="flashcard-inner-container">
          <div className="title-container">
            <h3 className="flashcards-dash-title">{term}</h3>
          </div>
        </div>
        <div className={`flashcards-dash-buttons ${theme}`}>
          <TiPencil
            className="flashdash-icons"
            onClick={() => handleUpdate(id)}
            title="atualizar"
            // onMouseOver={() => setTooltipUpdate((prev) => !prev)}
          />
          <AiFillDelete
            className="flashdash-icons"
            onClick={() => handleDelete(id)}
            title="deletar"
            // onMouseOver={() => setTooltipDelete((prev) => !prev)}
          />
        </div>
      </div>
      {/* implementação tooltip */}
      {/* {tooltipUpdate && <span className="tooltip-update">atualizar</span>}
      {tooltipDelete && <span className="tooltip-delete">deletar</span>} */}
    </>
  );
}
