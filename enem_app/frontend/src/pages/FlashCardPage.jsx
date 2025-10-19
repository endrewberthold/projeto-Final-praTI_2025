import { useEffect, useState } from 'react';

import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

import FlashCard from '../components/FlashCard';
import ModalForm from '../components/ModalForm';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

import { FaBookOpen, FaSpinner, FaPlus, FaLightbulb, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { TbMathFunction } from 'react-icons/tb';
import { GiMicroscope } from 'react-icons/gi';
import { FaGlobeAmericas } from 'react-icons/fa';
import { BsFillMortarboardFill } from 'react-icons/bs';

import '../styles/pages/flashCardPage.sass';

// API calls from services
import {
  fetchFlashcardsAPI,
  newFlashcardAPI,
  deleteFlashcardAPI,
  updateFlashcardAPI,
} from '../services/flashcardsServices';

export default function FlashcardPage() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState();
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [pages, setPages] = useState(1);
  const { theme } = useTheme();

  // For new Flashcard
  const [term, setTerm] = useState();
  const [areaId, setAreaId] = useState();
  const [description, setDescription] = useState();
  const [id, setId] = useState();
  const [newFlashcard, setNewFlascard] = useState(null);
  const [modalForm, setModalForm] = useState(false);

  // For update existent FlashCard
  const [updateRequest, setUpdateRequest] = useState(false);
  
  // For selected icon
  const [selectedIcon, setSelectedIcon] = useState('mortarboard');

  // For delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    flashcardId: null,
    flashcardTerm: ''
  });

  // For multiple selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    isOpen: false,
    selectedIds: [],
    selectedCount: 0
  });

  // Function to start delete loading
  const handleDeleteStart = () => {
    setIsDeleting(true);
    
    // Reset loading state after 1 second (apenas efeito visual)
    setTimeout(() => {
      setIsDeleting(false);
    }, 1000);
  };


  // For the first time the page loads
  useEffect(() => {
    handleFetchFlashcards();
  }, [newFlashcard]);

  // When the page first load it will first execute the fetch of all the user flashcards here.
  async function handleFetchFlashcards() {
    try {
      setIsLoading(true);
      const response = await fetchFlashcardsAPI(accessToken);
      setFlashcardsData(response?.data.content);
      setIsLoading(false);
      // setPages(response?.data.totalPages);

      //console.log("FLASHCARDS DATA: ", flashcardsData);
    } catch (err) {
      setIsLoading(false);
      if (!err?.response) {
        setMessage('No Server Response');
      } else if (err.response?.status === 400) {
        setMessage('Missing');
      } else if (err.response?.status === 401) {
        setMessage('Unauthorized');
      } else {
        setMessage('New Flash card creation failed');
      }
    }
  }

  // FOR NEW FLASHCARD
  async function handleNewFlashcard(e) {
    e.preventDefault();
    console.log(term);
    console.log(areaId);
    console.log(description);

    try {
      if (term != 'Selecione uma opção' && areaId && description) {
        const response = await newFlashcardAPI(
          accessToken,
          term,
          areaId,
          description,
        );
        setNewFlascard(response?.data);
      } else {
        setModalForm((prev) => !prev);
      }
    } catch (err) {
      console.log('ERRO: ', err);
    }
    handleClear();
  }

  // OPEN DELETE CONFIRMATION MODAL
  function handleDeleteFlashcard(flashcardId) {
    const flashcard = flashcardsData.find(item => item.id === flashcardId);
    setDeleteModal({
      isOpen: true,
      flashcardId: flashcardId,
      flashcardTerm: flashcard?.term || 'Flashcard'
    });
  }

  // CONFIRM DELETE FLASHCARD
  async function handleConfirmDelete() {
    try {
      const response = await deleteFlashcardAPI(accessToken, deleteModal.flashcardId);
      console.log('DELETADO: ', response);
      handleFetchFlashcards();
      setDeleteModal({ isOpen: false, flashcardId: null, flashcardTerm: '' });
    } catch (err) {
      console.log('ERRO ON DELETE CARD: ', err);
    }
  }

  // CLOSE DELETE MODAL
  function handleCloseDeleteModal() {
    setDeleteModal({ isOpen: false, flashcardId: null, flashcardTerm: '' });
  }

  // REQUEST UPDATE FLASHCARD
  // Will fill the input values with the select card and the id state
  async function handleRequestUpdateFlashcard(item) {
    console.log('UPDATE: ', item);
    //console.log("REQUEST UPDATE: ", updateFlashcard);

    setTerm(item.term);
    setAreaId(item.areaId);
    setDescription(item.description);
    setId(item.id);
    setUpdateRequest(true);
  }

  // UPDATE FLASHCARD
  // Will update the flashcard having it's id.
  async function handleUpdateFlashcard(e) {
    e.preventDefault();
    try {
      const response = await updateFlashcardAPI(
        accessToken,
        id,
        term,
        areaId,
        description,
      );
      setNewFlascard(response?.data);
    } catch (err) {
      console.log('ERRO: ', err);
    }
    handleClear(e);
  }

  const handleClear = (e) => {
    e.preventDefault();
    setTerm('');
    setDescription('');
  };

  const handleCloseModal = () => {
    setModalForm((prev) => !prev);
  };

  const handleIconClick = (iconName) => {
    setSelectedIcon(iconName);
  };

  // Funções para seleção múltipla
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedFlashcards([]);
    }
  };

  const toggleFlashcardSelection = (flashcardId) => {
    setSelectedFlashcards(prev => {
      if (prev.includes(flashcardId)) {
        return prev.filter(id => id !== flashcardId);
      } else {
        return [...prev, flashcardId];
      }
    });
  };

  const selectAllFlashcards = () => {
    if (selectedFlashcards.length === flashcardsData.length) {
      setSelectedFlashcards([]);
    } else {
      setSelectedFlashcards(flashcardsData.map(card => card.id));
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedFlashcards.length > 0) {
      setBulkDeleteModal({
        isOpen: true,
        selectedIds: selectedFlashcards,
        selectedCount: selectedFlashcards.length
      });
    }
  };

  const closeBulkDeleteModal = () => {
    setBulkDeleteModal({
      isOpen: false,
      selectedIds: [],
      selectedCount: 0
    });
  };

  const confirmBulkDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Deletar cada flashcard selecionado
      for (const flashcardId of bulkDeleteModal.selectedIds) {
        await deleteFlashcardAPI(accessToken, flashcardId);
      }
      
      // Atualizar a lista
      handleFetchFlashcards();
      
      // Limpar seleção
      setSelectedFlashcards([]);
      setIsSelectionMode(false);
      closeBulkDeleteModal();
      
    } catch (err) {
      console.log('ERRO AO DELETAR MÚLTIPLOS FLASHCARDS: ', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {modalForm && <ModalForm onClose={handleCloseModal} />}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este flashcard?"
        itemName={deleteModal.flashcardTerm}
      />
      <ConfirmDeleteModal
        isOpen={bulkDeleteModal.isOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={confirmBulkDelete}
        title="Confirmar Exclusão Múltipla"
        message={`Tem certeza que deseja excluir ${bulkDeleteModal.selectedCount} flashcard(s) selecionado(s)?`}
        itemName={`${bulkDeleteModal.selectedCount} flashcard(s)`}
      />
      <section
        className={`flashcard-container ${modalForm ? 'modal-active' : ''}`}
      >
        <form className={`form-flashcard-container `}>
          <h1>Criar Flashcard</h1>
          <nav className="nav-flashcard-container">
            <div className="nav-flashcard-title">
              <label>Título:</label>
              <input
                type="text"
                onChange={(e) => setTerm(e.target.value)}
                value={term}
                placeholder="Título"
              />
            </div>
            <div className="nav-flashcard-options">
              <label htmlFor="">Área de Conhecimento:</label>
              <select
                name="selectArea"
                id="areaId"
                onChange={(e) => setAreaId(e.target.value)}
              >
                <option>Selecione uma opção</option>
                <option value="LC">
                  Linguagens, Códigos e suas Tecnologias
                </option>
                <option value="CH">Ciências Humanas e suas Tecnologias</option>
                <option value="CN">
                  Ciências da Natureza e suas Tecnologias
                </option>
                <option value="MT">Matemáticas e suas Tecnologias</option>
              </select>
            </div>
          </nav>
          <div className="description-flashcard-container">
            <label htmlFor="">Descrição:</label>
            <textarea
              placeholder="Dados do Flashcard"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              rows="6"
            />
            <div className="buttons-flashcard-container">
              {/* <button onClick={handleNewFlashcard}>Criar Flashcard</button> */}
              {updateRequest ? (
                <button onClick={handleUpdateFlashcard}>Atualizar</button>
              ) : (
                <button onClick={handleNewFlashcard}>Criar</button>
              )}
              <button onClick={handleClear}>Limpar</button>
            </div>
          </div>
        </form>
        <section className="icons-flashcard-container">
          <div className="icons-section">
            <BsFillMortarboardFill 
              className={`icon-flashcard ${theme} ${selectedIcon === 'mortarboard' ? 'selected' : ''}`}
              onClick={() => handleIconClick('mortarboard')}
            />
            <FaBookOpen 
              className={`icon-flashcard ${theme} ${selectedIcon === 'book' ? 'selected' : ''}`}
              onClick={() => handleIconClick('book')}
            />
            <TbMathFunction 
              className={`icon-flashcard ${theme} ${selectedIcon === 'math' ? 'selected' : ''}`}
              onClick={() => handleIconClick('math')}
            />
            <GiMicroscope 
              className={`icon-flashcard ${theme} ${selectedIcon === 'microscope' ? 'selected' : ''}`}
              onClick={() => handleIconClick('microscope')}
            />
            <FaGlobeAmericas 
              className={`icon-flashcard ${theme} ${selectedIcon === 'globe' ? 'selected' : ''}`}
              onClick={() => handleIconClick('globe')}
            />
          </div>
          
          {/* Botões de seleção múltipla */}
          {flashcardsData && flashcardsData.length > 0 && (
            <div className="selection-buttons">
              <button 
                className={`selection-mode-btn ${isSelectionMode ? 'active' : ''}`}
                onClick={toggleSelectionMode}
              >
                {isSelectionMode ? <FaTimes /> : <FaCheck />}
                {isSelectionMode ? 'Cancelar' : 'Selecionar Múltiplos'}
              </button>
              
              {isSelectionMode && (
                <>
                  <button 
                    className="select-all-btn"
                    onClick={selectAllFlashcards}
                  >
                    {selectedFlashcards.length === flashcardsData.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </button>
                  
                  {selectedFlashcards.length > 0 && (
                    <button 
                      className="bulk-delete-btn"
                      onClick={openBulkDeleteModal}
                    >
                      <FaTrash />
                      Excluir ({selectedFlashcards.length})
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </section>
        
        <section className={`flashcard-dashboard-container ${theme} ${flashcardsData.length > 1 ? 'multiple-cards' : 'single-card'}`}>
          {isLoading || isDeleting ? (
            <div className="loading-container">
              <FaSpinner className="loading-spinner" />
              <p className="loading-text">
                {isDeleting ? "Excluindo flashcard..." : "Carregando flashcards..."}
              </p>
            </div>
          ) : flashcardsData && flashcardsData.length > 0 ? (
            <>
              {flashcardsData.map((item, index) => (
                <FlashCard
                  key={item.id}
                  id={item.id}
                  term={item.term}
                  description={item.description}
                  areaId={item.areaId}
                  index={index}
                  onDeleteStart={handleDeleteStart}
                  handleDelete={handleDeleteFlashcard}
                  handleUpdate={() => handleRequestUpdateFlashcard(item)}
                  isSelectionMode={isSelectionMode}
                  isSelected={selectedFlashcards.includes(item.id)}
                  onToggleSelection={() => toggleFlashcardSelection(item.id)}
                />
              ))}
            </>
          ) : (
            <div className="empty-flashcards-container">
              <FaLightbulb className="empty-icon" />
              <h3 className="empty-title">Nenhum flashcard encontrado</h3>
              <p className="empty-description">
                Que tal criar seu primeiro flashcard? É uma ótima forma de estudar e memorizar conteúdo!
              </p>
              <div className="empty-actions" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <FaPlus className="action-icon" />
                <span className="action-text">Use o formulário acima para começar</span>
              </div>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
