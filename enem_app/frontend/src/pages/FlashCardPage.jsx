import { useEffect, useState } from 'react';

import useForm from '../hooks/useForm';
import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

import Input from '../components/Form/Input';
import Select from '../components/Form/Select';
import Textarea from '../components/Form/Textarea';
import FlashCard from '../components/FlashCard';

import FlashCardPageButtons from '../components/FlashCardPageButtons';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

import {
  FaSpinner,
  FaPlus,
  FaLightbulb,
  FaTrash,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

// API calls from services
import {
  fetchFlashcardsAPI,
  newFlashcardAPI,
  deleteFlashcardAPI,
  updateFlashcardAPI,
} from '../services/flashcardsServices';

import '../styles/pages/flashCardPage.sass';

export default function FlashcardPage() {
  const { accessToken } = useAuth();
  const [message, setMessage] = useState();
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  // const [pages, setPages] = useState(1);
  const { theme } = useTheme();

  // For new Flashcard
  const [term, setTerm] = useState('');
  const [areaId, setAreaId] = useState('');
  const [description, setDescription] = useState('');
  const [id, setId] = useState();
  const [newFlashcard, setNewFlascard] = useState(null);

  // For update existent FlashCard
  const [updateRequest, setUpdateRequest] = useState(false);

  // For Forms
  const input = useForm('input');
  const select = useForm('select');
  const textarea = useForm('textarea');

  // For selected icon
  const [selectedIcon, setSelectedIcon] = useState('mortarboard');

  // For delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    flashcardId: null,
    flashcardTerm: '',
  });

  // For multiple selection
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    isOpen: false,
    selectedIds: [],
    selectedCount: 0,
  });

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
      const response = await newFlashcardAPI(
        accessToken,
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

  // REQUEST UPDATE FLASHCARD
  // Will fill the input values with the select card and the id state
  async function handleRequestUpdateFlashcard(item) {
    console.log('UPDATE: ', item);
    //console.log("REQUEST UPDATE: ", updateFlashcard);

    setTerm(item.term);
    setAreaId(item.areaId);
    setDescription(item.description);
    setId(item.id);

    input.setValue(item.term);
    select.setValue(item.areaId);
    textarea.setValue(item.description);

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

  // OPEN DELETE CONFIRMATION MODAL
  function handleDeleteFlashcard(flashcardId) {
    const flashcard = flashcardsData.find((item) => item.id === flashcardId);
    setDeleteModal({
      isOpen: true,
      flashcardId: flashcardId,
      flashcardTerm: flashcard?.term || 'Flashcard',
    });
  }

  // CONFIRM DELETE FLASHCARD
  async function handleConfirmDelete() {
    try {
      const response = await deleteFlashcardAPI(
        accessToken,
        deleteModal.flashcardId,
      );
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

  // Function to start delete loading
  const handleDeleteStart = () => {
    setIsDeleting(true);

    // Reset loading state after 1 second (apenas efeito visual)
    setTimeout(() => {
      setIsDeleting(false);
    }, 1000);
  };

  const handleClear = (e) => {
    e.preventDefault();
    input.setValue('');
    select.setValue('');
    textarea.setValue('');
    setTerm('');
    setDescription('');
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
    setSelectedFlashcards((prev) => {
      if (prev.includes(flashcardId)) {
        return prev.filter((id) => id !== flashcardId);
      } else {
        return [...prev, flashcardId];
      }
    });
  };

  const selectAllFlashcards = () => {
    if (selectedFlashcards.length === flashcardsData.length) {
      setSelectedFlashcards([]);
    } else {
      setSelectedFlashcards(flashcardsData.map((card) => card.id));
    }
  };

  const openBulkDeleteModal = () => {
    if (selectedFlashcards.length > 0) {
      setBulkDeleteModal({
        isOpen: true,
        selectedIds: selectedFlashcards,
        selectedCount: selectedFlashcards.length,
      });
    }
  };

  const closeBulkDeleteModal = () => {
    setBulkDeleteModal({
      isOpen: false,
      selectedIds: [],
      selectedCount: 0,
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
      <section className={`flashcard-container`}>
        <form className={`form-flashcard-container`}>
          <h1>Criar Flashcard</h1>
          <div className="form-input">
            <Input
              id="title"
              label="Título:"
              type="text"
              value={term}
              onChange={({ target }) => {
                setTerm(target.value);
                input.onChange({ target });
              }}
              onBlur={() => input.onBlur(term)}
              placeholder="Título"
              error={input.error}
              maxLength={40}
              required
            />
          </div>
          <div className="form-options">
            <Select
              label="Área de Conhecimento:"
              id="areaId"
              name="selectArea"
              value={areaId}
              onChange={({ target }) => {
                setAreaId(target.value);
                select.onChange({ target });
              }}
              onBlur={() => select.onBlur(areaId)}
              error={select.error}
            />
          </div>
          <div className="form-description">
            <Textarea
              id="description"
              label="Descrição:"
              value={description}
              onChange={({ target }) => {
                setDescription(target.value);
                textarea.onChange({ target });
              }}
              onBlur={() => textarea.onBlur(description)}
              placeholder="Dados do Flashcard"
              error={textarea.error}
              rows="3"
              maxLength={120}
              required
            />
          </div>
          <div className="buttons-flashcard-container">
            {updateRequest ? (
              <button onClick={handleUpdateFlashcard}>Atualizar</button>
            ) : (
              <button onClick={handleNewFlashcard}>Criar</button>
            )}
            <button onClick={handleClear}>Limpar</button>
          </div>
        </form>
        <section className="icons-flashcard-container">
          <FlashCardPageButtons />
        </section>
        {/* Botões de seleção múltipla */}
        {flashcardsData && flashcardsData.length > 0 && (
          <div className="selection-buttons">
            <button
              className={`selection-mode-btn ${
                isSelectionMode ? 'active' : ''
              }`}
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
                  {selectedFlashcards.length === flashcardsData.length
                    ? 'Desmarcar Todos'
                    : 'Selecionar Todos'}
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
      <section
        className={`flashcard-dashboard-container ${theme} ${
          flashcardsData.length > 1 ? 'multiple-cards' : 'single-card'
        }`}
      >
        {isLoading || isDeleting ? (
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
            <p className="loading-text">
              {isDeleting
                ? 'Excluindo flashcard...'
                : 'Carregando flashcards...'}
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
                areaName={item.areaName}
                areaId={item.areaId}
                index={index}
                onDeleteStart={handleDeleteStart}
                handleDelete={() => handleDeleteFlashcard(item.id)}
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
              Que tal criar seu primeiro flashcard? É uma ótima forma de estudar
              e memorizar conteúdo!
            </p>
            <div
              className="empty-actions"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <FaPlus className="action-icon" />
              <span className="action-text">
                Use o formulário acima para começar
              </span>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
