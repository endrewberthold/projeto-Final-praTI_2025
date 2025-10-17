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

  const extractErrorMessage = (err) => {
    try {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (!err?.response) return "Sem resposta do servidor";

      // 401: credenciais erradas
      if (status === 401) {
        const msg = data?.error || "Email ou senha incorretos";
        return msg;
      }

      // 400: validação ou usuário não encontrado
      if (status === 400) {
        if (typeof data === "object" && data && !data.error) {
          // Map de validação por campo
          const messages = Object.values(data);
          if (messages.length) return messages.join(" | ");
          return "Verifique os dados informados";
        }
        if (data?.error?.toLowerCase().includes("usuário não encontrado")) {
          return "Usuário não encontrado. Faça seu cadastro.";
        }
        return data?.error || "Dados inválidos";
      }

      // Outros códigos
      return data?.error || "Falha no login. Tente novamente mais tarde.";
    } catch (_) {
      return "Falha no login";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginAPI(email, password);

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.user.role;
      const userId = response?.data?.user.id;
      const userName = response?.data?.user.name;

      // Cria o objeto de autenticação completo
      const authData = { 
        email, 
        role, 
        accessToken,
        userId,
        userName,
        loginTime: new Date().toISOString() // Para controle de sessão
      };

      setAccessToken(accessToken);
      setAuth(authData);
      
      // Limpa os campos do formulário
      setEmail("");
      setPassword("");
      
      navigate(from, { replace: true });
    } catch (err) {
      const msg = extractErrorMessage(err);
      setMessage(msg);
      errRef.current?.focus();
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
            <path d="M480-100q-78.77 0-148.14-29.92-69.37-29.92-120.68-81.21-51.31-51.29-81.25-120.63Q100-401.1 100-479.93q0-78.84 29.92-148.21t81.21-120.68q51.29-51.31 120.63-81.25Q401.1-860 479.93-860q78.84 0 148.21 29.93 69.37 29.92 120.68 81.22t81.25 120.65Q860-558.85 860-480v48.77q0 54.77-37.61..."/>
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

        <label htmlFor="password">Senha</label>
        <div className="email-password-container" id="password-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M252.31-100q-29.92 0-51.12-21.19Q180-142.39 180-172.31v-375.38q0-29.92 21.19-51.12Q222.39-620 252.31-620H300v-80q0-74.92 52.54-127.46Q405.08-880 480-880q74.92 0 127.46 52.54Q660-774.92 660-700v80h47.69q29.92 0 51.12 21.19Q780-577.61 780-547.69v375.38q0 29.92-21.19 51.12Q737.61-1..."/>
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
              <path d="M630.92-441.08 586-486q9-49.69-28.35-89.35Q520.31-615 466-606l-44.92-44.92q13.54-6.08 27.77-9.12 14.23-3.04 31.15-3.04 68.08 0 115.58 47.5T643.08-500q0 16.92-3.04 31.54-3.04 14.61-9.12 27.38Zm127.23 124.46L714-358q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t..."/>
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
              <path d="M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-25..."/>
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
