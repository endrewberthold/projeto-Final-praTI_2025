import React, { useRef, useEffect, useState } from "react";
import "../styles/components/navbar.sass";
import { PiCards } from "react-icons/pi";
import { BsPerson, BsGrid } from "react-icons/bs";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useNavbar } from "../context/NavbarContext";
import { useTheme } from "../context/ThemeContext";
import { TbSettings } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import useAuth from "../hooks/useAuth";


export default function Navbar() {
  const menuRef = useRef(null);
  const menuBorderRef = useRef(null);
  const profileMenuRef = useRef(null);
  const { activeIndex, updateActiveIndex } = useNavbar();
  const { toggleTheme, isDark } = useTheme();
  const { clearAuth } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const firstLoad = useRef(true);
  const location = useLocation();

  // Esconde ou não o navbar
    const hideNavbar =
        location.pathname.includes("/answer/") ||
        location.pathname.includes("/feedback/") ||
        location.pathname.includes("/viewFlashPage/")

  // --- lógica da borda do menu (mantive sua implementação) ---
  useEffect(() => {
    // Não executa se a navbar estiver escondida
    if (hideNavbar) return;

    const offsetMenuBorder = () => {
      const menu = menuRef.current;
      const menuBorder = menuBorderRef.current;
      if (!menu || !menuBorder) return;
      
      // Pega o botão ativo, não o NavLink
      let activeItem = null;
      let itemIndex = 0;
      for (let i = 0; i < menu.children.length; i++) {
        const child = menu.children[i];
        if (child.tagName === 'A' && child.querySelector('button')) {
          if (itemIndex === activeIndex) {
            activeItem = child.querySelector('button');
            break;
          }
          itemIndex++;
        }
      }
      
      if (!activeItem) return;

      const offsetActiveItem = activeItem.getBoundingClientRect();
      const offsetMenu = menu.getBoundingClientRect();

      const left =
        Math.floor(
          offsetActiveItem.left -
            offsetMenu.left -
            (menuBorder.offsetWidth - offsetActiveItem.width) / 2
        ) + "px";

      menuBorder.style.transform = `translate3d(${left}, 0, 0)`;
    };

    const menuBorder = menuBorderRef.current;
    if (!menuBorder) return;

    // Adiciona um pequeno delay para garantir que o DOM foi atualizado
    const updateBorder = () => {
      if (firstLoad.current) {
        // sem transição no primeiro load
        menuBorder.style.transition = "none";
        offsetMenuBorder();
        requestAnimationFrame(() => {
          menuBorder.style.transition = "";
          firstLoad.current = false;
        });
      } else {
        offsetMenuBorder();
      }
    };

    // Aguarda um frame para garantir que o navbar foi renderizado
    requestAnimationFrame(() => {
      setTimeout(updateBorder, 0);
    });

    const handleResize = () => {
      if (hideNavbar) return;
      menuBorder.style.transition = "none";
      offsetMenuBorder();
      requestAnimationFrame(() => {
        menuBorder.style.transition = "";
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, hideNavbar]);

  // Fecha o profile dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === "Escape") setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleClick = (index) => {
    if (menuRef.current) menuRef.current.style.removeProperty("--timeOut");
    updateActiveIndex(index);
  };

  const handleLogout = () => {
    clearAuth();
    setProfileOpen(false);
    navigate("/", { replace: true });
  };
    if (hideNavbar) return null

  return (
    <>
      <div className="navbar-container">
        <div style={{ width: "20rem" }}></div>{" "}
        <menu className="menu" ref={menuRef}>
          <NavLink to="/userStatusPage">
            <button
              className={`menu__item${activeIndex === 0 ? " active" : ""}`}
              style={{ "--bgColorItem": "#668fccff" }}
              onClick={() => handleClick(0)}
              type="button"
            >
              <svg className="icon" viewBox="0 0 24 24" fill="#ffffffff">
                <BsPerson fill="#fff" size={23} />
              </svg>
            </button>
          </NavLink>

          <NavLink to="/dashboard">
            <button
              className={`menu__item${activeIndex === 1 ? " active" : ""}`}
              style={{ "--bgColorItem": "#668fccff" }}
              onClick={() => handleClick(1)}
              type="button"
            >
              <svg className="icon" viewBox="0 0 24 24">
                <BsGrid color="#ffff" size={23} />
              </svg>
            </button>
          </NavLink>

          <NavLink to="/flashCardPage">
            <button
              className={`menu__item${activeIndex === 2 ? " active" : ""}`}
              style={{ "--bgColorItem": "#668fccff" }}
              onClick={() => handleClick(2)}
              type="button"
            >
              <svg className="icon" viewBox="0 0 24 24" fill="#4e6dc2ff">
                <PiCards fill="#ffffffff" size={23} />
              </svg>
            </button>
          </NavLink>

          <div className="menu__border" ref={menuBorderRef}></div>

          {/* Menu lateral */}
          <div className="iconesLateral">
            <div className="icone-conteiner">
              {/* Toggle de tema */}
              <div className="button">
                <label
                  htmlFor="themeToggle"
                  className="themeToggle st-sunMoonThemeToggleBtn"
                  aria-hidden="true"
                >
                  <input
                    type="checkbox"
                    id="themeToggle"
                    className="themeToggleInput"
                    aria-label="Alternar tema"
                    checked={isDark}
                    onChange={toggleTheme}
                  />
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="none"
                  >
                    <mask id="moon-mask">
                      <rect x="0" y="0" width="20" height="20" fill="white"></rect>
                      <circle cx="11" cy="3" r="8" fill="black"></circle>
                    </mask>
                    <circle
                      className="sunMoon"
                      cx="10"
                      cy="10"
                      r="8"
                      mask="url(#moon-mask)"
                    ></circle>
                    <g>
                      <circle className="sunRay sunRay1" cx="18" cy="10" r="1.5"></circle>
                      <circle className="sunRay sunRay2" cx="14" cy="16.928" r="1.5"></circle>
                      <circle className="sunRay sunRay3" cx="6" cy="16.928" r="1.5"></circle>
                      <circle className="sunRay sunRay4" cx="2" cy="10" r="1.5"></circle>
                      <circle className="sunRay sunRay5" cx="6" cy="3.1718" r="1.5"></circle>
                      <circle className="sunRay sunRay6" cx="14" cy="3.1718" r="1.5"></circle>
                    </g>
                  </svg>
                </label>
              </div>

              {/* Botão de perfil + dropdown */}
              <div
                className="button profile-wrapper"
                ref={profileMenuRef}
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="profile-button"
                  type="button"
                  title="Abrir menu do perfil"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ffffffff"
                    aria-hidden="true"
                  >
                    <path d="M480-492.31q-57.75 0-98.87-41.12Q340-574.56 340-632.31q0-57.75 41.13-98.87 41.12-41.13 98.87-41.13 57.75 0 98.87 41.13Q620-690.06 620-632.31q0 57.75-41.13 98.88-41.12 41.12-98.87 41.12ZM180-187.69v-88.93q0-29.38 15.96-54.42 15.96-25.04 42.66-38.5 59.3-29.07 119.65-43.61 60.35-14.54 121.73-14.54t121.73 14.54q60.35 14.54 119.65 43.61 26.7 13.46 42.66 38.5Q780-306 780-276.62v88.93H180Zm60-60h480v-28.93q0-12.15-7.04-22.5-7.04-10.34-19.11-16.88-51.7-25.46-105.42-38.58Q534.7-367.69 480-367.69q-54.7 0-108.43 13.11-53.72 13.12-105.42 38.58-12.07 6.54-19.11 16.88-7.04 10.35-7.04 22.5v28.93Zm240-304.62q33 0 56.5-23.5t23.5-56.5q0-33-23.5-56.5t-56.5-23.5q-33 0-56.5 23.5t-23.5 56.5q0 33 23.5 56.5t56.5 23.5Zm0-80Zm0 384.62Z" />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    className="profile-dropdown"
                    role="menu"
                    aria-label="Menu do perfil"
                  >
                    <button
                      className="profile-dropdown__item"
                      type="button"
                      role="menuitem"
                    >
                      <TbSettings size={20} />
                      <span>Configurações</span>
                    </button>
                    <button
                      className="profile-dropdown__item"
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LuLogOut size={20} />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* svg container */}
            <div className="svg-container">
              <svg viewBox="0 0 202.9 45.5">
                <clipPath
                  id="menu"
                  clipPathUnits="objectBoundingBox"
                  transform="scale(0.0049285362247413 0.021978021978022)"
                >
                  <path d="M6.7,0.0c5.7-0.1,14.1,0.4,23.3,4c5.7,2.3,9.9,5,18.1,10.5c10.7,7.1,11.8,9.2,20.6,14.3c5,2.9,9.2,5.2,15.2,7c7.1,2.1,13.3,2.3,17.6,2.1c4.2,0.2,10.5-0.1,17.6-2.1c6.1-1.8,10.2-4.1,15.2-7c8.8-5,9.9-7.1,20.6-14.3c8.3-5.5,12.4-8.2,18.1-10.5c9.2-3.6,17.6-4.2,23.3-4H6.7z" />
                </clipPath>
              </svg>
            </div>
          </div>
        </menu>
      </div>
    </>
  );
}
