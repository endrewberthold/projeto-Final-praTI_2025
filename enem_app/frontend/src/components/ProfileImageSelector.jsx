import React, { useState, useEffect } from "react";
import "../styles/components/ProfileImageSelector.sass";
import { CiImageOff } from "react-icons/ci";

export default function ProfileImageSelector({
  value = null,
  onChange = () => {},
  maleAvatars = [
    "/Male/10.png",
    "/Male/17.png",
    "/Male/18.png",
    "/Male/41.png",
    "/Male/42.png",
  ],
  femaleAvatars = [
    "/Female/56.png",
    "/Female/57.png",
    "/Female/64.png",
    "/Female/73.png",
    "/Female/91.png",
  ],
  buttonLabel = "Escolher imagem de perfil",
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);
  const [tab, setTab] = useState("male");

  useEffect(() => {
    setSelected(value);
  }, [value]);

  function openModal() {
    setOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    setOpen(false);
    document.body.style.overflow = "";
  }

  function confirmSelection() {
    onChange(selected);
    closeModal();
  }

  const avatars = tab === "male" ? maleAvatars : femaleAvatars;

  return (
    <div className="profile-image-selector">

              <div className="pis-preview">
        {selected ? (
          <img src={selected} alt="Avatar selecionado" />
        ) : (
          <div className="pis-placeholder"> < CiImageOff size={30}/> </div>
        )}
      </div>

      <button type="button" className="pis-open-btn" onClick={openModal}>
        {buttonLabel}
      </button>

      {open && (
        <div className="pis-modal">
          <div className="pis-overlay" onClick={closeModal} />

          <div className="pis-panel">
            <header className="pis-header">
              <h3>Escolha sua imagem de perfil</h3>
              <button className="pis-close" onClick={closeModal}>
                ✕
              </button>
            </header>

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

            <footer className="pis-footer">
              <button className="pis-btn pis-cancel" onClick={closeModal}>
                Cancelar
              </button>
              <button
                className="pis-btn pis-confirm"
                onClick={confirmSelection}
                disabled={!selected}
              >
                Confirmar
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

