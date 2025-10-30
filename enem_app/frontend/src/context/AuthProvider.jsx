import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  // Recupera dados salvos do localStorage ao inicializar
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth ? JSON.parse(savedAuth) : {};
  });
  
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });
  
  const [persist, setPersist] = useState(() => {
    const savedPersist = localStorage.getItem("persist");
    return savedPersist ? JSON.parse(savedPersist) : false;
  });

  // Salva dados no localStorage sempre que mudarem
  useEffect(() => {
    if (persist) {
      if (auth && Object.keys(auth).length > 0) {
        localStorage.setItem("auth", JSON.stringify(auth));
      }
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
    } else {
      // Remove dados do localStorage se persist for false
      localStorage.removeItem("auth");
      localStorage.removeItem("accessToken");
    }
  }, [auth, accessToken, persist]);

  // Salva configuração de persist
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  // Função customizada para limpar autenticação
  const clearAuth = () => {
    setAuth({});
    setAccessToken(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("accessToken");
    if (!persist) {
      localStorage.removeItem("persist");
    }
    
    // NOTA: Removido o reset forçado do tema para manter a preferência do usuário
    // O tema deve persistir independentemente do estado de autenticação
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        persist,
        setPersist,
        accessToken,
        setAccessToken,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
