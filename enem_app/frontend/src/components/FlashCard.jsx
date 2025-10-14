import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

import { AiFillDelete } from 'react-icons/ai';
import { TiPencil } from 'react-icons/ti';

import '../styles/components/Flashcard.sass';

export default function Flashcard({
  id,
  term,
  description,
  areaName,
  handleDelete,
  handleUpdate,
}) {
  const { theme } = useTheme();
  const navigate = useNavigate();

  // implementar tooltip para botões flashcard (futuramente)
  // const [tooltipUpdate, setTooltipUpdate] = useState(true);
  // const [tooltipDelete, setTooltipDelete] = useState(false);

  const handleNavigate = (e) => {
    navigate(`/viewFlashPage/${id}`, {
      state: { term, description, areaName },
    });
  };

  const handleClickUpdate = (e) => {
    e.stopPropagation();
    handleUpdate();
  };

  const handleClickDelete = (e) => {
    e.stopPropagation();
    handleDelete();
  };

  return (
    <>
      <div
        className={`flashcards-dashboard ${theme}`}
        onClick={handleNavigate}
        title="Abrir Flashcard"
      >
        <span className="flashcards-dash-area">{areaName}</span>
        <div className="title-container">
          <h3 className="flashcards-dash-title">{term}</h3>
        </div>
        <div className={`flashcards-dash-buttons ${theme}`}>
          <TiPencil
            className="flashdash-icons"
            onClick={handleClickUpdate}
            title="atualizar"
            // onMouseOver={() => setTooltipUpdate((prev) => !prev)}
          />
          <AiFillDelete
            className="flashdash-icons"
            onClick={handleClickDelete}
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
