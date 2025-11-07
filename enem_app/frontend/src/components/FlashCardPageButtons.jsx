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
    icon: TbMathFunction,
    areaId: 'MT',
    area: 'Matemáticas e suas Tecnologias',
  },
  {
    icon: GiMicroscope,
    areaId: 'CN',
    area: 'Ciências da Natureza e suas Tecnologias',
  },
  {
    icon: FaGlobeAmericas,
    areaId: 'CH',
    area: 'Ciências Humanas e suas Tecnologias',
  },
];

const FlashCardPageButtons = ({ setSelectedAreaIds, selectedAreaIds, theme }) => {
  console.log('FlashCardPageButtons renderizando com tema:', theme);
  
  const isSelected = (areaId) => {
    if (areaId === 'ALL') {
      return selectedAreaIds.length === 0;
    }
    return selectedAreaIds.includes(areaId);
  };
  
  return (
    <div className="icons-flashcard-container">
      {pageButtons.map((item, i) => {
        const IconComponent = item.icon;
        const selected = isSelected(item.areaId);
        return (
          <button
            key={i}
            className={`icon-flashcard ${theme} ${selected ? 'selected' : ''}`}
            title={item.area}
            area={item.area ? `${item.area}` : ''}
            areaid={item.areaId ? `${item.areaId}` : ''}
            onClick={() => {
              item.areaId == 'ALL'
                ? setSelectedAreaIds([])
                : setSelectedAreaIds([item.areaId]);
            }}
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
