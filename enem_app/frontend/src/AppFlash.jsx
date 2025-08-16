import { useState } from 'react';
import Flashcard from './components/Flashcard/Flashcard';
import './styles/components/App.scss';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockCardData = {
    title: 'Tema ou Matéria a Estudar aqui',
    difficulty: 'hard',
    initialContent: '',
    // Algumas informações já adicionadas
    questionId: '/questions/123',
  };

  const handleModal = () => {
    setIsModalOpen((modal) => !modal);
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
