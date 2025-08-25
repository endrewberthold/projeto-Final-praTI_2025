import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./styles/main.sass";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserStatusPage from "./pages/UserStatusPage.jsx";
import FlashCardPage from "./pages/FlashCardPage.jsx";
import PraticarPage from "./pages/PraticarPage.jsx";
import TelaLogin from "./pages/TelaLogin.jsx";
import QuestionPage from "./pages/QuestionPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/flashcards" element={<FlashCardPage />} />
          <Route path="/userStatus" element={<UserStatusPage />} />
          <Route path="/praticar" element={<PraticarPage />} />
          <Route path="/login" element={<TelaLogin />} />
          <Route path="/question" element={<QuestionPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
