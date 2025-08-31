import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './styles/main.sass';
import App from './App.jsx'; // O seu componente App.jsx

// Importe todas as páginas que você precisa
import Dashboard from './pages/Dashboard.jsx';
import UserStatusPage from './pages/UserStatusPage.jsx';
import FlashCardPage from './pages/FlashCardPage.jsx';
import PraticarPage from './pages/PraticarPage.jsx';
import TelaLogin from './pages/TelaLogin.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/*
          Use a rota de login como a rota inicial.
          Quando o caminho for "/", a página de login será renderizada.
        */}
        <Route path="/" element={<TelaLogin />} />

        {/*
          As outras rotas devem ser separadas
          e acessadas após o login.
        */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/flashcards" element={<FlashCardPage />} />
        <Route path="/userStatus" element={<UserStatusPage />} />
        <Route path="/praticar" element={<PraticarPage />} />

        {/*
          Se você tem um componente que serve como layout para as páginas
          pós-login (como Home.jsx), você pode usá-lo assim:
        */}
        <Route path="/home" element={<App />}>
          {/* Essas rotas ficarão dentro do layout de Home */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="flashcards" element={<FlashCardPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
