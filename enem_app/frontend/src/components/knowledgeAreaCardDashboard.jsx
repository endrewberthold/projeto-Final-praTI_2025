// FlashCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/components/knowledgeAreaCardDashboard.sass'

export default function Flash({
  title,
  description,
  icon,
  variant = 'card',
  className = '',
  ...rest
}) {
  const baseClass = `flash ${variant} ${className}`;

  return (
    <article className={baseClass} {...rest}>
      <div className="flash-content">
        <div className="flash-icon">{icon}</div>
        <div className="flash-text">
          <h3 className="flash-title">{title}</h3>
          {description && <p className="flash-description">{description}</p>}
        </div>
      </div>
    </article>
  );
}

Flash.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  icon: PropTypes.node,
  variant: PropTypes.oneOf(['card', 'compact']),
  className: PropTypes.string,
};
