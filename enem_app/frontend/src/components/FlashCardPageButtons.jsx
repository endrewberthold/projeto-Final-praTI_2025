import React from 'react';

import {
  FaBookOpen,
  FaGlobeAmericas,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaPlus,
  FaLightbulb,
} from 'react-icons/fa';
import { TbMathFunction } from 'react-icons/tb';
import { GiMicroscope } from 'react-icons/gi';
import { BsFillMortarboardFill } from 'react-icons/bs';

import '../styles/components/flashCardPageButtons.sass';

const pageButtons = [
  {
    icon: BsFillMortarboardFill,
    area: '',
  },
  { icon: FaBookOpen, area: 'Linguagens, Códigos e suas Tecnologias' },
  { icon: FaGlobeAmericas, area: 'Ciências Humanas e suas Tecnologias' },
  { icon: GiMicroscope, area: 'Ciências da Natureza e suas Tecnologias' },
  { icon: TbMathFunction, area: 'Matemáticas e suas Tecnologias' },
];

const FlashCardPageButtons = ({ theme }) => {
  console.log('FlashCardPageButtons renderizando com tema:', theme);
  
  return (
    <div className="icons-flashcard-container">
      {pageButtons.map((item, i) => {
        const IconComponent = item.icon;
        return (
          <button
            key={i}
            className={`icon-flashcard ${theme}`}
            title={item.area}
            // onClick={handleSelectArea}
          >
            <div className="icon-wrapper">
              <IconComponent />
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default FlashCardPageButtons;
