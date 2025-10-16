import React from "react";
import "../styles/components/LoginForm.sass";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import { loginAPI } from "../services/userServices";

export default function LoginForm() {
  const { setAuth, persist, setPersist, setAccessToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Tentando fazer login com:", { email, password: "***" });

    try {
      const response = await loginAPI(email, password);
      console.log("Resposta do login:", response);

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.user?.role;
      const userId = response?.data?.user?.id;
      const userName = response?.data?.user?.name;

      console.log("Dados extraídos:", { accessToken, role, userId, userName });

      // Cria o objeto de autenticação completo
      const authData = { 
        email, 
        role, 
        accessToken,
        userId,
        userName,
        loginTime: new Date().toISOString() // Para controle de sessão
      };

      console.log("AuthData criado:", authData);

      setAccessToken(accessToken);
      setAuth(authData);
      
      // Limpa os campos do formulário
      setEmail("");
      setPassword("");
      
      console.log("Login successful. Persist:", persist);
      console.log("Auth data:", authData);
      
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Erro completo no login:", err);
      console.error("Erro response:", err?.response);
      console.error("Erro status:", err?.response?.status);
      console.error("Erro data:", err?.response?.data);
      
      if (!err?.response) {
        setMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setMessage("Missing email or Password");
      } else if (err.response?.status === 401) {
        setMessage("Unauthorized");
      } else {
        setMessage("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <div className="login-form">
      <p
        ref={errRef}
        className={message ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {message}
      </p>
     
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <div className="email-password-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M480-100q-78.77 0-148.14-29.92-69.37-29.92-120.68-81.21-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.93 69.37 29.92 120.68 81.22t81.25 120.65Q860-558.85 860-480v48.77q0 54.77-37.61 93T730-300q-35.39 0-65.62-17.31-30.23-17.31-47.77-47.62Q590.69-334 555.35-317 520-300 480-300q-74.92 0-127.46-52.54Q300-405.08 300-480q0-74.92 52.54-127.46Q405.08-660 480-660q74.92 0 127.46 52.54Q660-554.92 660-480v48.77q0 29.46 20.27 50.35Q700.54-360 730-360q29.46 0 49.73-20.88Q800-401.77 800-431.23V-480q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93h200v60H480Zm0-260q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Z" />
          </svg>

          <input
            type="email"
            placeholder="Digite seu email"
            id="email"
            ref={userRef}
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <label htmlFor="password">Password</label>
        <div className="email-password-container" id="password-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M252.31-100q-29.92 0-51.12-21.19Q180-142.39 180-172.31v-375.38q0-29.92 21.19-51.12Q222.39-620 252.31-620H300v-80q0-74.92 52.54-127.46Q405.08-880 480-880q74.92 0 127.46 52.54Q660-774.92 660-700v80h47.69q29.92 0 51.12 21.19Q780-577.61 780-547.69v375.38q0 29.92-21.19 51.12Q737.61-100 707.69-100H252.31Zm0-60h455.38q5.39 0 8.85-3.46t3.46-8.85v-375.38q0-5.39-3.46-8.85t-8.85-3.46H252.31q-5.39 0-8.85 3.46t-3.46 8.85v375.38q0 5.39 3.46 8.85t8.85 3.46ZM480-290q29.15 0 49.58-20.42Q550-330.85 550-360t-20.42-49.58Q509.15-430 480-430t-49.58 20.42Q410-389.15 410-360t20.42 49.58Q450.85-290 480-290ZM360-620h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80ZM240-160v-400 400Z" />
          </svg>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Digite sua senha"
            id="password"
            name="senha"
            minLength={6}
            maxLength={12}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />

          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowPassword(!showPassword)}
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M630.92-441.08 586-486q9-49.69-28.35-89.35Q520.31-615 466-606l-44.92-44.92q13.54-6.08 27.77-9.12 14.23-3.04 31.15-3.04 68.08 0 115.58 47.5T643.08-500q0 16.92-3.04 31.54-3.04 14.61-9.12 27.38Zm127.23 124.46L714-358q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-46.61-46.61q37.92-15.08 77.46-22.23Q438.39-780 480-780q140.61 0 253.61 77.54T898.46-500q-22.23 53.61-57.42 100.08-35.2 46.46-82.89 83.3Zm32.31 231.39L628.62-245.85q-30.77 11.39-68.2 18.62Q523-220 480-220q-141 0-253.61-77.54Q113.77-375.08 61.54-500q22.15-53 57.23-98.88 35.08-45.89 77.23-79.58l-110.77-112 42.16-42.15 705.22 705.22-42.15 42.16Zm-552.3-551.08q-31.7 25.23-61.66 60.66Q146.54-540.23 128-500q50 101 143.5 160.5T480-280q27.31 0 54.39-4.62 27.07-4.61 45.92-9.53L529.69-346q-10.23 4.15-23.69 6.61-13.46 2.47-26 2.47-68.08 0-115.58-47.5T316.92-500q0-12.15 2.47-25.42 2.46-13.27 6.61-24.27l-87.84-86.62ZM541-531Zm-131.77 65.77Z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => setShowPassword(!showPassword)}
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-251.43-76.12Q115.16-372.23 61.54-500q53.62-127.77 167.02-203.88Q341.97-780 479.95-780q137.97 0 251.43 76.12Q844.84-627.77 898.46-500q-53.62 127.77-167.02 203.88Q618.03-220 480.05-220ZM480-500Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
            </svg>
          )}
        </div>

        <div className="helpers">
          <div className="checkbox">
            <input
              type="checkbox"
              id="persist"
              onChange={togglePersist}
              checked={persist}
            />
            <label htmlFor="persist">Manter-se conectado?</label>
          </div>

          <a>Esqueceu a senha?</a>
        </div>

        <button type="submit">Entrar</button>
      </form>

      <p className="register-container">
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </p>
    </div>
  );
}
