import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PiCards } from "react-icons/pi";
import { BsPerson, BsGrid } from "react-icons/bs";
import { TbSettings } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useNavbar } from "../context/NavbarContext";
import useAuth from "../hooks/useAuth";
import "../styles/components/mobileNavbar.sass";

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { activeIndex, updateActiveIndex } = useNavbar();
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    setIsOpen(false);
    navigate("/", { replace: true });
  };

  const handleMenuClick = (index) => {
    updateActiveIndex(index);
    setIsOpen(false);
  };

  // Limpa o estado do body quando o componente for desmontado
  useEffect(() => {
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Controla o scroll do body
    if (!isOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  };

  return (
    <>
      <div className="mobile-navbar">
        <div className="mobile-navbar__header">
          <h2 className="mobile-navbar__logo">ENEM App</h2>
          <button 
            className="mobile-navbar__toggle"
            onClick={toggleMenu}
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Overlay */}
        {isOpen && (
          <div 
            className="mobile-navbar__overlay"
            onClick={toggleMenu}
          />
        )}

        {/* Menu lateral */}
        <nav className={`mobile-navbar__menu ${isOpen ? 'mobile-navbar__menu--open' : ''}`}>
          <div className="mobile-navbar__menu-content">
            {/* Header do menu */}
            <div className="mobile-navbar__menu-header">
              <h3>Menu</h3>
              <button 
                className="mobile-navbar__close"
                onClick={toggleMenu}
                aria-label="Fechar menu"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Links de navegação */}
            <div className="mobile-navbar__links">
              <NavLink 
                to="/userStatusPage"
                className={`mobile-navbar__link ${activeIndex === 0 ? 'active' : ''}`}
                onClick={() => handleMenuClick(0)}
              >
                <BsPerson size={20} />
                <span>Perfil</span>
              </NavLink>

              <NavLink 
                to="/dashboard"
                className={`mobile-navbar__link ${activeIndex === 1 ? 'active' : ''}`}
                onClick={() => handleMenuClick(1)}
              >
                <BsGrid size={20} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink 
                to="/flashCardPage"
                className={`mobile-navbar__link ${activeIndex === 2 ? 'active' : ''}`}
                onClick={() => handleMenuClick(2)}
              >
                <PiCards size={20} />
                <span>FlashCards</span>
              </NavLink>

              <NavLink 
                to="/ai"
                className="mobile-navbar__link"
                onClick={() => setIsOpen(false)}
              >
                <span style={{fontSize: '18px'}}>🤖</span>
                <span>ENEM AI</span>
              </NavLink>
            </div>

            {/* Divisor */}
            <div className="mobile-navbar__divider"></div>

            {/* Configurações */}
            <div className="mobile-navbar__settings">
              <button className="mobile-navbar__setting-item">
                <TbSettings size={20} />
                <span>Configurações</span>
              </button>

              <button 
                className="mobile-navbar__setting-item mobile-navbar__logout"
                onClick={handleLogout}
              >
                <LuLogOut size={20} />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}