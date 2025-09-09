import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import PraticarPage from "./pages/PraticarPage";
import FlashCardPage from "./pages/FlashCardPage";
import UserStatusPage from "./pages/UserStatusPage";
import NotfountPage from "./pages/NotfountPage";
import FormularioLogin from "./components/FormularioLogin";

import Home from "./pages/Home";

import TelaLogin from "./pages/TelaLogin";
import Enter from "./pages/Enter";
import RequireAuth from "./components/RequiredAuth";

// IMPORTANTE: Mude a rota principal para o componente de login
// const router = createBrowserRouter([
//   {
//     // A rota "/" agora vai para a TelaLogin
//     path: "/",
//     element: <TelaLogin />,
//     errorElement: <NotfountPage />,
//   },
//   {
//     path: "/praticar",
//     element: <PraticarPage />,
//   },
//   {
//     path: "/flashcards",
//     element: <FlashCardPage />,
//   },
//   {
//     path: "/userStatus",
//     element: <UserStatusPage />,
//   },
//   {
//     // A sua rota de login ainda pode existir para ser acessada diretamente
//     path: "/login",
//     element: <TelaLogin />,
//   },
//   {
//     // Crie uma rota separada para o Dashboard
//     path: "/dashboard",
//     element: <Dashboard />,
//   },
// ]);

function App() {
  //return <RouterProvider router={router} />;

  return (
    <>
      <Routes>
        <Route path="/" element={<Enter />}>
          {/* Public Routes */}
          <Route path="/" element={<FormularioLogin />} />

          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashcardPage" element={<FlashCardPage />} />
            <Route path="/userStatusPage" element={<UserStatusPage />} />
            <Route path="/SkillPage" element={<PraticarPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
