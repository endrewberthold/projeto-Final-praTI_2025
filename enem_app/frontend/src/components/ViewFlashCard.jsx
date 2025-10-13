import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

import { TiPencil } from 'react-icons/ti';
import { AiFillDelete } from 'react-icons/ai';

import '../styles/components/ViewFlashCard.sass';

const ViewFlashCard = () => {
  const params = useParams();
  const location = useLocation();
  const { term, description, areaName, handleUpdate, handleDelete } =
    location.state || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState(false);

  // inicialização do cartão com um conteúdo do back ou vazio
  useEffect(() => {
    if (term && description) {
      setCardContent((prev) => !prev);
    }
  }, [term, description]);

  useEffect(() => console.log(cardContent), [cardContent]);

  //Deletar ?
  const deleteFlashCard = () => {
    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      // Logic to handle delete functionality
      console.log(`Card ${term} excluído!`);
    }
  };

  return (
    <section className="card-container">
      {cardContent && (
        <div
          className={`card ${isFlipped ? 'flipped' : ''}`}
          onClick={() => setIsFlipped((prev) => !prev)}
        >
          <div className="innerCard">
            <div className="face frontside">
              <div className="card-id">Card n॰{params.id}</div>
              <span>{areaName}</span>
              <span className="question-text">{term}</span>
            </div>
            <div className="face backside">
              <span>{areaName}</span>
              <span className="answer-text">{description}</span>
              <div>
                <TiPencil
                  className="flashview-icons pencil"
                  title="editar"
                  onClick={() => handleUpdate(params.id)}
                />
                <AiFillDelete
                  className="flashview-icons trash"
                  title="deletar"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewFlashCard;

// e.stopPropagation();
