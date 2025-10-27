import React from 'react';
import { FaTimes } from "react-icons/fa";
import '../styles/components/abandonSessionModal.sass';

export default function AbandonSessionModal({
                                               isOpen,
                                               onClose,
                                               onConfirm,
                                               message
                                           }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="confirm-abandon-session" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <div className="modal-body">
                    <p className="confirm-message">{message}</p>
                </div>
                    <button className="confirm-button" onClick={onConfirm}>
                        Abandonar sessão
                    </button>
            </div>
        </div>
    );
}