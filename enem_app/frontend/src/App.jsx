import { RouterProvider } from "react-router-dom";

import { Routes, Route } from "react-router-dom";

import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";

import FlashCardPage from "./pages/FlashCardPage";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

import RequireAuth from "./components/RequiredAuth";
import UserStatusPage from "./pages/UserStatusPage";
import SkillPage from "./pages/SkillPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/flashCardPage" element={<FlashCardPage />} />
          <Route path="/userStatusPage" element={<UserStatusPage />} />
          <Route path="/skillPage" element={<SkillPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
