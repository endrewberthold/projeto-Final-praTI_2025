import React, { useState, useEffect } from "react";
import "../styles/components/ProfileImageSelector.sass";
import { CiImageOff } from "react-icons/ci";
import { FaTimes, FaUser } from "react-icons/fa";

export default function ProfileImageSelector({
  value = null,
  onChange = () => {},
  maleAvatars = [
    "/Male/avatar_transparent.png",
    "/Male/avatar2_transparent.png",
    "/Male/avatar3_transparent.png",
    "/Male/avatar4_transparent.png",
  ],
  femaleAvatars = [
    "/Female/avatar5_transparent.png",
    "/Female/avatar6_transparent.png",
    "/Female/avatar7_transparent.png",
    "/Female/avatar8_transparent.png",
  ],
  buttonLabel = "Escolher imagem de perfil",
  isOpen = null, // Para controle externo do modal
  onClose = null, // Para controle externo do modal
  showButton = true, // Para mostrar ou esconder o botão
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState("male");

  // Determina se o modal está aberto (controle interno ou externo)
  const isModalOpen = isOpen !== null ? isOpen : open;

  useEffect(() => {
    setSelected(value);
  }, [value]);

  function openModal() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (onClose) {
      onClose(); // Usar função externa se fornecida
    } else {
      setOpen(false); // Usar controle interno
    }
    document.body.style.overflow = "";
  }

  function confirmSelection() {
    onChange(selected);
    closeModal();
  }

  const avatars = tab === "male" ? maleAvatars : femaleAvatars;

  return (
    <div className="profile-image-selector">
      {showButton && (
        <>
          <div className="pis-preview">
            {selected ? (
              <img src={selected} alt="Avatar selecionado" />
            ) : (
              <div className="pis-placeholder">
                {" "}
                <CiImageOff size={30} />{" "}
              </div>
            )}
          </div>

          <button type="button" className="pis-open-btn" onClick={openModal}>
            {buttonLabel}
          </button>
        </>
      )}

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="profile-image-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="modal-title">
                <FaUser className="title-icon" />
                <h3>Escolha sua imagem de perfil</h3>
              </div>
              <button className="close-button" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="pis-tabs">
                <button
                  className={tab === "male" ? "active" : ""}
                  onClick={() => setTab("male")}
                >
                  Masculino
                </button>
                <button
                  className={tab === "female" ? "active" : ""}
                  onClick={() => setTab("female")}
                >
                  Feminino
                </button>
              </div>

              <div className="pis-grid">
                {avatars.map((src, idx) => (
                  <button
                    key={src}
                    className={
                      "pis-avatar " + (selected === src ? "selected" : "")
                    }
                    onClick={() => setSelected(src)}
                  >
                    <img src={src} alt={`Avatar ${tab} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="confirm-button"
                onClick={confirmSelection}
                disabled={!selected}
              >
                <FaUser />
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
