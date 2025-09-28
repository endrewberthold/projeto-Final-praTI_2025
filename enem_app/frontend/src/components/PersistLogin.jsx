import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist, setAuth, accessToken, setAccessToken } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        // Tenta usar o refresh token se disponível
        await refresh();
      } catch (err) {
        console.error("Refresh token failed:", err);
        // Se o refresh falhar, limpa os dados de autenticação
        const authData = localStorage.getItem("auth");
        const savedAccessToken = localStorage.getItem("accessToken");
        
        if (authData && savedAccessToken) {
          // Remove dados inválidos do localStorage
          localStorage.removeItem("auth");
          localStorage.removeItem("accessToken");
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    const restoreAuthFromStorage = () => {
      try {
        const savedAuth = localStorage.getItem("auth");
        const savedAccessToken = localStorage.getItem("accessToken");
        
        if (savedAuth && savedAccessToken) {
          const parsedAuth = JSON.parse(savedAuth);
          
          // Verifica se os dados salvos são válidos
          if (parsedAuth && parsedAuth.email && parsedAuth.role) {
            setAuth(parsedAuth);
            setAccessToken(savedAccessToken);
          } else {
            // Remove dados inválidos
            localStorage.removeItem("auth");
            localStorage.removeItem("accessToken");
          }
        }
      } catch (err) {
        console.error("Error restoring auth from storage:", err);
        // Remove dados corrompidos
        localStorage.removeItem("auth");
        localStorage.removeItem("accessToken");
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    if (!persist) {
      // Se persist é false, não tenta restaurar nada
      setIsLoading(false);
    } else if (!auth?.accessToken && !accessToken) {
      // Se não há token na memória, tenta restaurar do localStorage
      const savedAccessToken = localStorage.getItem("accessToken");
      if (savedAccessToken) {
        // Se há um token salvo, tenta verificar se ainda é válido
        verifyRefreshToken();
      } else {
        // Se não há token salvo, apenas restaura dados básicos se existirem
        restoreAuthFromStorage();
      }
    } else {
      // Já há dados de auth na memória
      setIsLoading(false);
    }

    return () => (isMounted = false);
  }, [persist, auth?.accessToken, accessToken, refresh, setAuth, setAccessToken]);

  useEffect(() => {
    console.log(`isLoading: ${isLoading}`);
    console.log(`aT: ${JSON.stringify(auth?.accessToken || accessToken)}`);
    console.log(`persist: ${persist}`);
  }, [isLoading, auth, accessToken, persist]);

  return (
    <>
      {!persist ? (
        <Outlet />
      ) : isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Carregando...</p>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistLogin;
