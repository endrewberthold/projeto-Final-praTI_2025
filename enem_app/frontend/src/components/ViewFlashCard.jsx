import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { IoCloseCircleOutline } from 'react-icons/io5';

import '../styles/components/ViewFlashCard.sass';

const ViewFlashCard = () => {
  const params = useParams();
  const location = useLocation();
  const { term, description, areaName } = location.state || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (term && description) {
      setCardContent((prev) => !prev);
    }
  }, [term, description]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  return (
    <div className="card-container">
      <section className="section-card-container">
        {cardContent && (
          <div
            className={`innercard-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="innercard">
              <div className="face frontside">
                <span>{areaName}</span>
                <div className="card-id">Card n॰{params.id}</div>
                <span className="question-text">{term}</span>
              </div>
              <div className="face backside">
                <span>{areaName}</span>
                <span className="answer-text">{description}</span>
              </div>
            </div>
          </div>
        )}
      </section>
      <IoCloseCircleOutline
        className={`card-close-icon ${isFlipped ? 'flipped' : ''}`}
        onClick={() => navigate('/flashCardPage')}
      />
    </div>
  );
};

export default ViewFlashCard;
