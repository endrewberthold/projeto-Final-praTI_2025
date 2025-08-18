import { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard/Flashcard';
import './styles/components/app.sass';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockCardData = {
    title: 'Palavra ou Tema aqui',
    difficulty: 'medium',
    initialContent: '',
    questionId: '/questions/123',
  };

  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Meus Flashcards</h1>
        <button className="open-card-btn" onClick={handleModal}>
          Abrir Flashcard
        </button>
      </header>

      {isModalOpen && <Flashcard data={mockCardData} onClose={handleModal} />}
    </div>
  );
}

export default App;
