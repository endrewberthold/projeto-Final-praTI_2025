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
    areaId: 'ALL',
    area: '',
  },
  {
    icon: FaBookOpen,
    areaId: 'LC',
    area: 'Linguagens, Códigos e suas Tecnologias',
  },
  {
    icon: FaGlobeAmericas,
    areaId: 'CH',
    area: 'Ciências Humanas e suas Tecnologias',
  },
  {
    icon: GiMicroscope,
    areaId: 'CN',
    area: 'Ciências da Natureza e suas Tecnologias',
  },
  {
    icon: TbMathFunction,
    areaId: 'MT',
    area: 'Matemáticas e suas Tecnologias',
  },
];

const FlashCardPageButtons = ({ setSelectedAreaIds, theme }) => {
  return (
    <div className="icons-flashcard-container">
      {pageButtons.map((item, i) => {
        const IconComponent = item.icon;
        return (
          <IconComponent
            key={i}
            className={`icon-flashcard ${theme}`}
            area={item.area ? `${item.area}` : ''}
            areaid={item.areaId ? `${item.areaId}` : ''}
            onClick={() => {
              item.areaId == 'ALL'
                ? setSelectedAreaIds([])
                : setSelectedAreaIds([item.areaId]);
            }}
          />
        );
      })}
    </div>
  );
};

export default FlashCardPageButtons;
