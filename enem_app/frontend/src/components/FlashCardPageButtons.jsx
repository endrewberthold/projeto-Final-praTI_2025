import React from 'react';

import { FaBookOpen } from 'react-icons/fa';
import { TbMathFunction } from 'react-icons/tb';
import { GiMicroscope } from 'react-icons/gi';
import { FaGlobeAmericas } from 'react-icons/fa';
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
  return (
    <div className="icons-flashcard-container">
      {pageButtons.map((item, i) => {
        const IconComponent = item.icon;
        return (
          <IconComponent
            key={i}
            className={`icon-flashcard ${theme}`}
            name={`${item.area}`}
            // onClick={handleSelectArea}
          />
        );
      })}
    </div>
  );
};

export default FlashCardPageButtons;
