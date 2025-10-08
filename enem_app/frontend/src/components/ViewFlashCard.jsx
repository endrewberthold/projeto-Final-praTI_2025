import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { LuFileQuestion } from 'react-icons/lu';
import { TiPencil } from 'react-icons/ti';
import { FaRegTrashAlt } from 'react-icons/fa';

import '../styles/components/ViewFlashCard.sass';

const ViewFlashCard = ({ onClose }) => {
  const params = useParams();
  const location = useLocation();
  const { term, description, areaId } = location.state || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState(false);

  // inicialização do cartão com um conteúdo do back ou vazio
  useEffect(() => {
    if (term && description && areaId) {
      setCardContent(true);
    }
  }, [term, description, areaId]);

  //Editar ?
  const handleEdit = () => {
    console.log('Editar card');
  };

  //Deletar ?
  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      // Logic to handle delete functionality
      console.log(`Card ${term} excluído!`);
      onClose();
    }
  };

  // verificação e trigger do flip
  const handleCardClick = (e) => {
    if (
      e.target.tagName !== 'BUTTON' &&
      e.target.tagName !== 'TEXTAREA' &&
      e.target.className !== 'card-actions-container'
    ) {
      handleFlip();
    }
  };

  return (
    <section className="card-container">
      <div
        className={`card ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped((prev) => !prev)}
      >
        <div>{params.id}</div>
        <div className="innerCard">
          <div className="face frontside">
            <span>{areaId}</span>
            <span className="question-text">{term}</span>
          </div>
          <div className="face backside">
            <span>{areaId}</span>
            <span className="answer-text">{description}</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewFlashCard;

// e.stopPropagation();
