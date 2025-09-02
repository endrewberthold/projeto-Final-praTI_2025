import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PraticarPage from "./pages/PraticarPage";
import FlashCardPage from "./pages/FlashCardPage";
import UserStatusPage from "./pages/UserStatusPage";
import NotfountPage from "./pages/NotfountPage";
import FormularioLogin from "./components/FormularioLogin";

import TelaLogin from "./pages/TelaLogin";

// IMPORTANTE: Mude a rota principal para o componente de login
const router = createBrowserRouter([
  {
    // A rota "/" agora vai para a TelaLogin
    path: "/",
    element: <TelaLogin />,
    errorElement: <NotfountPage />,
  },
  {
    path: "/praticar",
    element: <PraticarPage />,
  },
  {
    path: "/flashcards",
    element: <FlashCardPage />,
  },
  {
    path: "/userStatus",
    element: <UserStatusPage />,
  },
  {
    // A sua rota de login ainda pode existir para ser acessada diretamente
    path: "/login",
    element: <TelaLogin />,
  },
  {
    // Crie uma rota separada para o Dashboard
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
