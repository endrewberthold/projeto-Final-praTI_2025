import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Recupera o tema salvo no localStorage ou usa 'light' como padrão
    return localStorage.getItem('theme') || 'light';
  });

  const isDark = theme === 'dark';

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Aplica a classe do tema no body quando o tema muda
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Escuta mudanças no localStorage (como quando o logout reseta o tema)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };

    // Adiciona listener para mudanças no localStorage
    window.addEventListener('storage', handleStorageChange);

    // Também cria um listener customizado para mudanças na mesma aba
    const handleLocalThemeChange = (event) => {
      setTheme(event.detail.theme);
    };

    window.addEventListener('themeChanged', handleLocalThemeChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleLocalThemeChange);
    };
  }, []);

  const value = {
    theme,
    toggleTheme,
    isDark
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};