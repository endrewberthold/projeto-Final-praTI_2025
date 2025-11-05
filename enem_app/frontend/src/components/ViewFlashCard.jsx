import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { GoX } from 'react-icons/go';
import { FaChevronLeft, FaChevronRight, FaRandom } from 'react-icons/fa';

import useAuth from '../hooks/useAuth';
import { fetchFlashcardsAPI } from '../services/flashcardsServices';

import '../styles/components/ViewFlashCard.sass';

const ViewFlashCard = () => {
  const params = useParams();
  const location = useLocation();
  const { accessToken } = useAuth();
  const { term, description, areaName: initialAreaName, selectedAreaFilter = 'ALL' } = location.state || {};

  const [isFlipped, setIsFlipped] = useState(false);
  const [cardContent, setCardContent] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const [filteredFlashcards, setFilteredFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAreaName, setCurrentAreaName] = useState(initialAreaName || '');

  const navigate = useNavigate();
  const currentCardId = parseInt(params.id);

  useEffect(() => {
    if (term && description) {
      setCardContent((prev) => !prev);
    }
    // Atualiza areaName quando location.state mudar
    if (initialAreaName) {
      setCurrentAreaName(initialAreaName);
    }
  }, [term, description, initialAreaName]);

  useEffect(() => {
    // Esconde scrollbar do body quando o componente monta
    document.body.style.overflow = 'hidden';
    document.body.style.scrollbarWidth = 'none';
    document.body.style.msOverflowStyle = 'none';
    document.documentElement.style.overflow = 'hidden';
    
    // Adiciona classe para esconder scrollbar
    document.body.classList.add('no-scrollbar');
    document.documentElement.classList.add('no-scrollbar');
    
    return () => {
      // Restaura scrollbar quando o componente desmonta
      document.body.style.overflow = '';
      document.body.style.scrollbarWidth = '';
      document.body.style.msOverflowStyle = '';
      document.documentElement.style.overflow = '';
      document.body.classList.remove('no-scrollbar');
      document.documentElement.classList.remove('no-scrollbar');
    };
  }, []);

  useEffect(() => {
    async function fetchFlashcards() {
      try {
        const response = await fetchFlashcardsAPI(accessToken);
        const allFlashcards = response?.data.content || [];
        setFlashcards(allFlashcards);
        
        // Aplica o filtro baseado em selectedAreaFilter
        let cardsToShow = allFlashcards;
        if (selectedAreaFilter !== 'ALL') {
          // Filtra apenas os flashcards da área selecionada
          cardsToShow = allFlashcards.filter(card => card.areaId === selectedAreaFilter);
        }
        setFilteredFlashcards(cardsToShow);
        
        // Encontra o índice do card atual nos flashcards filtrados
        const index = cardsToShow.findIndex(card => card.id === currentCardId);
        setCurrentIndex(index >= 0 ? index : 0);
        
        // Se encontrou o card, atualiza o areaName
        if (index >= 0) {
          const currentCard = cardsToShow[index];
          setCurrentAreaName(currentCard.areaName || '');
        } else if (initialAreaName) {
          // Se não encontrou mas tem areaName inicial, mantém
          setCurrentAreaName(initialAreaName);
        }
      } catch (err) {
        console.error('Erro ao buscar flashcards:', err);
      }
    }
    
    fetchFlashcards();
  }, [accessToken, currentCardId, initialAreaName, selectedAreaFilter]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped((prev) => !prev);
  };

  const handlePrevious = () => {
    if (filteredFlashcards.length === 0) return;
    
    const previousIndex = currentIndex === 0 ? filteredFlashcards.length - 1 : currentIndex - 1;
    const previousCard = filteredFlashcards[previousIndex];
    setIsFlipped(false);
    setCardContent(false);
    navigate(`/viewFlashPage/${previousCard.id}`, {
      state: {
        term: previousCard.term,
        description: previousCard.description,
        areaName: previousCard.areaName,
        areaId: previousCard.areaId,
        selectedAreaFilter: selectedAreaFilter // Mantém o filtro selecionado
      }
    });
  };

  const handleNext = () => {
    if (filteredFlashcards.length === 0) return;
    
    const nextIndex = currentIndex === filteredFlashcards.length - 1 ? 0 : currentIndex + 1;
    const nextCard = filteredFlashcards[nextIndex];
    setIsFlipped(false);
    setCardContent(false);
    navigate(`/viewFlashPage/${nextCard.id}`, {
      state: {
        term: nextCard.term,
        description: nextCard.description,
        areaName: nextCard.areaName,
        areaId: nextCard.areaId,
        selectedAreaFilter: selectedAreaFilter // Mantém o filtro selecionado
      }
    });
  };

  const handleRandom = () => {
    if (filteredFlashcards.length === 0) return;
    
    // Gera um índice aleatório diferente do atual
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * filteredFlashcards.length);
    } while (randomIndex === currentIndex && filteredFlashcards.length > 1);
    
    const randomCard = filteredFlashcards[randomIndex];
    setIsFlipped(false);
    setCardContent(false);
    navigate(`/viewFlashPage/${randomCard.id}`, {
      state: {
        term: randomCard.term,
        description: randomCard.description,
        areaName: randomCard.areaName,
        areaId: randomCard.areaId,
        selectedAreaFilter: selectedAreaFilter
      }
    });
  };

  const totalCards = filteredFlashcards.length;
  const progress = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;
  // No carrossel infinito, sempre há anterior e próximo disponíveis
  const hasPrevious = totalCards > 1;
  const hasNext = totalCards > 1;

  return (
    <div className="card-container">
      {totalCards > 0 && (
        <div className="progress-indicator">
          <div className="progress-info">
            <span className="progress-text">
              {currentIndex + 1} / {totalCards}
            </span>
            {currentAreaName && (
              <span className="progress-area-name">
                {currentAreaName}
              </span>
            )}
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <section className="section-card-container">
        {cardContent && (
          <div
            className={`innercard-container ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="innercard">
              <div className="face frontside">
                <span className="question-text">{term}</span>
              </div>
              <div className="face backside">
                <span className="answer-text">{description}</span>
              </div>
            </div>
          </div>
        )}
        
        {totalCards > 1 && (
          <div className="carousel-controls">
            <button
              className={`carousel-control carousel-prev ${!hasPrevious ? 'disabled' : ''}`}
              onClick={handlePrevious}
              disabled={!hasPrevious}
              aria-label="Card anterior"
            >
              <FaChevronLeft />
            </button>
            <button
              className={`carousel-control carousel-random ${!hasNext ? 'disabled' : ''}`}
              onClick={handleRandom}
              disabled={!hasNext}
              aria-label="Card aleatório"
            >
              <FaRandom />
            </button>
            <button
              className={`carousel-control carousel-next ${!hasNext ? 'disabled' : ''}`}
              onClick={handleNext}
              disabled={!hasNext}
              aria-label="Próximo card"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </section>
      <GoX
        className={`card-close-icon ${isFlipped ? 'flipped' : ''}`}
        onClick={() => navigate('/flashCardPage')}
      />
    </div>
  );
};

export default ViewFlashCard;
