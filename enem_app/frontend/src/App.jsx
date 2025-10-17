import { RouterProvider } from 'react-router-dom';

import { Routes, Route } from 'react-router-dom';

import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';

import FlashCardPage from './pages/FlashCardPage';
import ViewFlashCard from './components/ViewFlashCard';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import RequireAuth from './components/RequiredAuth';
import PersistLogin from './components/PersistLogin';
import UserStatusPage from './pages/UserStatusPage';
import SkillPage from './pages/SkillPage';
import Answers from './pages/Answers';
import FeedbackPage from "./pages/FeedbackPage.jsx";
import './styles/components/app.sass';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Persistent Authentication Wrapper */}
        <Route element={<PersistLogin />}>
          {/* Protected Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flashCardPage" element={<FlashCardPage />} />
            <Route path="/viewFlashPage/:id" element={<ViewFlashCard />} />
            <Route path="/userStatusPage" element={<UserStatusPage />} />
            <Route path="/skillPage/:id" element={<SkillPage />} />
            <Route path="/answer/:levelId" element={<Answers />} />
            <Route path="/skillPage/:id/answer/:levelId" element={<Answers />} /> //rota para o quiz
              <Route path="/skillPage/:id/feedback/:sessionId" element={<FeedbackPage />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
