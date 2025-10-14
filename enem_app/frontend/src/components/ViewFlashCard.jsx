import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
    <div onClick={() => navigate('/flashCardPage')}>
      <section className="card-container">
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
    </div>
  );
};

export default ViewFlashCard;
