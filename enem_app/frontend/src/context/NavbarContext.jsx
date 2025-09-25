import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Criando o contexto para o estado da navbar
const NavbarContext = createContext();

// Hook personalizado para usar o contexto
export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar deve ser usado dentro de um NavbarProvider');
  }
  return context;
};

// Mapeamento de rotas para índices da navbar
const routeToIndex = {
  '/userStatusPage': 0,
  '/dashboard': 1,
  '/flashCardPage': 2,
  '/skillPage': 1, // SkillPage pode usar o mesmo índice do dashboard ou ter um próprio
};

// Provider do contexto
export const NavbarProvider = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(1); // Dashboard é o padrão (índice 1)
  const location = useLocation();

  // Sincroniza o activeIndex com a rota atual
  useEffect(() => {
    const currentPath = location.pathname;
    const index = routeToIndex[currentPath];
    
    if (index !== undefined) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  // Função para atualizar o índice ativo manualmente
  const updateActiveIndex = (index) => {
    setActiveIndex(index);
  };

  const value = {
    activeIndex,
    updateActiveIndex,
  };

  return (
    <NavbarContext.Provider value={value}>
      {children}
    </NavbarContext.Provider>
  );
};