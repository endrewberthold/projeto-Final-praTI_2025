import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NavBar from "./NavBar";
import MobileNavbar from "./MobileNavbar";
import { NavbarProvider } from "../context/NavbarContext";
import { AiFloatingButton } from "../components/AiAssistant";

const RequireAuth = () => {
  const { auth, accessToken } = useAuth();
  const location = useLocation();

  // Verifica se há token válido (seja do estado ou do localStorage)
  const hasValidToken = auth?.accessToken || accessToken;
  const hasValidRole =
    auth?.role && (auth.role === "USER" || auth.role === "ADMIN");

  //console.log("RequireAuth - Auth:", auth);
  //console.log("RequireAuth - AccessToken:", accessToken);
  //console.log("RequireAuth - HasValidToken:", hasValidToken);
  //console.log("RequireAuth - HasValidRole:", hasValidRole);

  // Se tem token e role válidos, permite acesso
  if (hasValidToken && hasValidRole) {
    return (
      <NavbarProvider>
        <NavBar />
        <MobileNavbar />
        <Outlet />
        <AiFloatingButton />
      </NavbarProvider>
    );
  }

  // Se tem token mas não tem role, tenta verificar se os dados estão sendo carregados
  if (hasValidToken && !hasValidRole) {
    // Pode estar carregando dados do localStorage, aguarda um pouco
    console.log("Has token but missing role, redirecting to dashboard");
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Se não tem token, redireciona para login
  console.log("No valid token, redirecting to login");
  return <Navigate to="/" state={{ from: location }} replace />;
};

export default RequireAuth;
