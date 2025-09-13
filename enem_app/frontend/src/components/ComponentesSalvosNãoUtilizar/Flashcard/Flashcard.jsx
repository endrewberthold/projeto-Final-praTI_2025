import { useState, useEffect } from 'react';
import { LuFileQuestion } from 'react-icons/lu';
import { TiPencil } from 'react-icons/ti';
import { FaRegTrashAlt } from 'react-icons/fa';

import '../../styles/components/Flashcard.sass';

const Flashcard = ({ data, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState('');

  const {
    title = 'Palavra ou tema aqui',
    difficulty = 'easy',
    initialContent = '',
    questionId = '#',
  } = data || {};

  // inicialização do cartão com um conteúdo do back ou vazio
  useEffect(() => {
    if (initialContent) {
      setCardContent(initialContent);
    }
  }, [initialContent]);

  // capturando valores da textarea
  const handleTextareaChange = (event) => {
    setCardContent(event.target.value);
  };

  // trocando valores de 'isFlipped' p iniciar a ação de flip(virar)
  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  //futura ação de editar
  const handleEdit = () => {
    console.log('Editar card');
  };

  // deletar cartão
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      // Logic to handle delete functionality
      console.log(`Card ${title} excluído!`);
      onClose();
    }
  };

  // verificação e trigger do flip
  const handleCardClick = (e) => {
    e.stopPropagation();
    if (
      e.target.tagName !== 'BUTTON' &&
      e.target.tagName !== 'TEXTAREA' &&
      e.target.className !== 'card-actions-container'
    ) {
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
        <div className="flashcard-front-container">
          {difficulty && (
            <div
              className={`difficulty-indicator difficulty-${difficulty.toLowerCase()}`}
            ></div>
          )}
          <h2 className="card-title">{title}</h2>
          <button
            className={`remember-button difficulty-${difficulty.toLowerCase()}`}
          >
            Lembrar-se
          </button>
        </div>

        {/* Verso do Card */}
        <div className="flashcard-back-container">
          {difficulty && (
            <div
              className={`difficulty-indicator difficulty-${difficulty.toLowerCase()}`}
            ></div>
          )}
          <div className="card-back-title-container">
            <h2 className="card-title card-back-tilte">{title}</h2>
            <LuFileQuestion className="luFile-icon" />
          </div>
          <textarea
            className={`card-textarea difficulty-${difficulty.toLowerCase()}`}
            value={cardContent}
            onChange={handleTextareaChange}
            placeholder="Explicação da palavra/Anotações aqui (deve ter um máximo de caracteres)"
          ></textarea>
          <div className="card-actions-container">
            <button
              className={`ocultar-btn difficulty-${difficulty.toLowerCase()}`}
              onClick={handleFlip}
            >
              Ocultar
            </button>
            <div className="action-btn">
              <TiPencil className="action-btn-icon" onClick={handleEdit} />
              <FaRegTrashAlt
                className="action-btn-icon"
                onClick={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
