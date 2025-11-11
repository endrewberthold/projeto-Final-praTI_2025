import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

import "./styles/main.sass";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/*" element={<App />}></Route>
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
