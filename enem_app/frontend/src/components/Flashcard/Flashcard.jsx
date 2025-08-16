import { useState, useEffect } from 'react';
import '../../styles/components/Flashcard.scss';

const Flashcard = ({ data, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState('');

  const {
    title = 'Palavra ou tema aqui',
    difficulty = 'easy',
    initialContent = '',
    questionId = '#',
  } = data || {};

  // Initialize cardContent with the data or an empty string
  useEffect(() => {
    if (initialContent) {
      setCardContent(initialContent);
    }
  }, [initialContent]);

  const handleTextareaChange = (event) => {
    setCardContent(event.target.value);
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleEdit = () => {
    // Logic to handle edit functionality
    console.log('Editar card');
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      // Logic to handle delete functionality
      console.log(`Card ${title} excluído!`);
      onClose();
    }
  };

  const handleCardClick = (e) => {
    e.stopPropagation();
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
      handleFlip();
    }
  };

  return (
    <div className="flashcard-modal-overlay" onClick={onClose}>
      <div
        className={`flashcard-container ${isFlipped ? 'is-flipped' : ''}`}
        onClick={handleCardClick}
      >
        {/* Frente do Card */}
        <div className="flashcard-front">
          {difficulty && (
            <div
              className={`difficulty-indicator difficulty-${difficulty.toLowerCase()}`}
            ></div>
          )}
          <h2 className="card-title">{title}</h2>
          <button className="remember-button">Lembrar-se</button>
        </div>

        {/* Verso do Card */}
        <div className="flashcard-back">
          {difficulty && (
            <div
              className={`difficulty-indicator difficulty-${difficulty.toLowerCase()}`}
            ></div>
          )}
          <h2 className="card-title card-tilte-back">{title}</h2>
          <textarea
            className="card-textarea"
            value={cardContent}
            onChange={handleTextareaChange}
            placeholder="Explicação da palavra/Anotações aqui (deve ter um máximo de caracteres)"
          ></textarea>
          <div className="card-actions">
            <button className="action-btn ocultar-btn" onClick={handleFlip}>
              Ocultar
            </button>
            <button
              className="action-btn edit-btn"
              onClick={handleEdit}
            ></button>
            <button
              className="action-btn delete-btn"
              onClick={handleDelete}
            ></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
