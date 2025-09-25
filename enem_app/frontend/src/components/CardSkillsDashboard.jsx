// FlashCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/cardSkillsDashboard.sass'

export default function CardSkillsDashboard({
  title,
  description,
  icon,
  variant = 'card',
  className = '',
  ...rest
}) {
  const baseClass = `cardSkills ${variant} ${className}`;

  return (
    <article className={baseClass} {...rest}>
      <div className="cardSkills-content">
        <div className="cardSkills-icon">{icon}</div>
        <div className="cardSkills-text">
          <h3 className="cardSkills-title">{title}</h3>
          {description && <p className="cardSkills-description">{description}</p>}
        </div>
      </div>
    </article>
  );
}

CardSkillsDashboard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['card', 'compact']),
  className: PropTypes.string,
};
