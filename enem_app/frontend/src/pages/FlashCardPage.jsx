import { useEffect, useState } from 'react';

import useAuth from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import useForm from '../hooks/useForm';

import Input from '../components/Form/Input';
// import Select from '../components/Form/Select';
import Textarea from '../components/Form/Textarea';
import FlashCard from '../components/FlashCard';

import { FaBookOpen } from 'react-icons/fa';
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
  // const [pages, setPages] = useState(1);
  const { theme } = useTheme();

  // For new Flashcard
  const [term, setTerm] = useState();
  const [areaId, setAreaId] = useState();
  const [description, setDescription] = useState();
  const [id, setId] = useState();
  const [newFlashcard, setNewFlascard] = useState(null);

  // For update existent FlashCard
  const [updateRequest, setUpdateRequest] = useState(false);

  // For Forms
  // const [] = useForm();

  // For the first time the page loads
  useEffect(() => {
    handleFetchFlashcards();
  }, [newFlashcard]);

  // When the page first load it will first execute the fetch of all the user flashcards here.
  async function handleFetchFlashcards() {
    try {
      const response = await fetchFlashcardsAPI(accessToken);
      setFlashcardsData(response?.data.content);
      // setPages(response?.data.totalPages);

      //console.log("FLASHCARDS DATA: ", flashcardsData);
    } catch (err) {
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
      }
    } catch (err) {
      console.log('ERRO: ', err);
    }
    handleClear();
  }

  // DELETE FLASHCARD
  // $ Will be refactored in the future, it does not need a response, only if it display something in the screen
  async function handleDeleteFlashcard(item) {
    //console.log("DELETE: ", item);
    const id = item;
    const DELETECARD_URL = `/api/flashcards/${id}`;

    try {
      const response = await deleteFlashcardAPI(accessToken, item);
      console.log('DELETADO: ', response);
      handleFetchFlashcards();
    } catch (err) {
      console.log('ERRO ON DELETE CARD: ', err);
    }
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

  const handleSelectArea = () => {
    return flashcardsData.map((item) => item.areaName);
  };

  const pageButtons = [
    {
      icon: BsFillMortarboardFill,
      area: 'Linguagens, Códigos e suas Tecnologias',
    },
    { icon: FaBookOpen, area: 'Linguagens, Códigos e suas Tecnologias' },
    { icon: FaGlobeAmericas, area: 'Ciências Humanas e suas Tecnologias' },
    { icon: GiMicroscope, area: 'Ciências da Natureza e suas Tecnologias' },
    { icon: TbMathFunction, area: 'Ciências da Natureza e suas Tecnologias' },
  ];

  return (
    <section className={`flashcard-container`}>
      <form className={`form-flashcard-container`}>
        <h1>Criar Flashcard</h1>
        <div className="form-title">
          <Input
            label="Título:"
            type="text"
            value={term}
            onChange={({ target }) => setTerm(target.value)}
            placeholder="Título"
            maxLength={40}
            required
          />
        </div>
        <div className="form-options">
          <label htmlFor="">Área de Conhecimento:</label>
          <select
            name="selectArea"
            id="areaId"
            onChange={({ target }) => setAreaId(target.value)}
          >
            <option value="" disabled>
              Selecione uma opção
            </option>
            <option value="LC">Linguagens, Códigos e suas Tecnologias</option>
            <option value="CH">Ciências Humanas e suas Tecnologias</option>
            <option value="CN">Ciências da Natureza e suas Tecnologias</option>
            <option value="MT">Matemáticas e suas Tecnologias</option>
          </select>
        </div>
        {/* <div className="form-options">
          <Select
            label="Área de Conhecimento:"
            id="areaId"
            name="selectArea"
            onChange={({ target }) => setAreaId(target.value)}
            value1={'LC'}
            value2={'CH'}
            value3={'CN'}
            value4={'MT'}
            area1={'Linguagens, Códigos e suas Tecnologias'}
            area2={'Ciências Humanas e suas Tecnologias'}
            area3={'Ciências da Natureza e suas Tecnologias'}
            area4={'Matemáticas e suas Tecnologias'}
            required
          />
        </div> */}
        <div className="form-description">
          <Textarea
            label="Descrição:"
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            placeholder="Dados do Flashcard"
            rows="3"
            maxLength={120}
            required
          />
          <div className="buttons-flashcard-container">
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
        <div>
          {pageButtons.map((item, i) => {
            const IconComponent = item.icon;
            return (
              <IconComponent
                key={i}
                className={`icon-flashcard ${theme}`}
                name={`${item.area}`}
                onClick={handleSelectArea}
              />
            );
          })}
        </div>
      </section>
      <section className={`flashcard-dashboard-container ${theme}`}>
        {flashcardsData && flashcardsData.length > 0 ? (
          <>
            {flashcardsData.map((item) => (
              <FlashCard
                key={item.id}
                id={item.id}
                term={item.term}
                description={item.description}
                areaName={item.areaName}
                areaId={item.areaId}
                handleDelete={() => handleDeleteFlashcard(item.id)}
                handleUpdate={() => handleRequestUpdateFlashcard(item)}
              />
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </section>
  );
}
