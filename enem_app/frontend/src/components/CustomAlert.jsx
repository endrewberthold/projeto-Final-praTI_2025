import React, { useEffect } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

import '../styles/components/customAlert.sass';

export default function CustomAlert({ 
  isOpen, 
  onClose, 
  title = "Atenção",
  message = "Selecione uma alternativa!",
  type = "warning" // warning, error, info, success
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FaExclamationTriangle className="alert-icon error" />;
      case 'success':
        return <FaExclamationTriangle className="alert-icon success" />;
      case 'info':
        return <FaExclamationTriangle className="alert-icon info" />;
      default:
        return <FaExclamationTriangle className="alert-icon warning" />;
    }
  };

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className={`custom-alert ${type}`} onClick={(e) => e.stopPropagation()}>
        <div className="alert-header">
          <div className="alert-title">
            {getIcon()}
            <h4>{title}</h4>
          </div>
          <button className="alert-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="alert-body">
          <p>{message}</p>
        </div>
        
        <div className="alert-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}
