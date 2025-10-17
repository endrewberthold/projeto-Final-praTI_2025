import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileImageSelector from "./ProfileImageSelector";

import { registerAPI } from "../services/userServices";
import "../styles/components/RegisterForm.sass"

export default function RegisterForm() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const userRef = useRef();
  const errRef = useRef();
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const extractErrorMessage = (err) => {
    try {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (!err?.response) return "Sem resposta do servidor";

      if (status === 400) {
        // Validações de campo (mapa field -> message)
        if (typeof data === "object" && data && !data.error) {
          const messages = Object.values(data);
          if (messages.length) return messages.join(" | ");
          return "Verifique os dados informados";
        }
        if (data?.error?.toLowerCase().includes("email já cadastrado")) {
          return "Este e-mail já está cadastrado. Faça login ou recupere sua senha.";
        }
        return data?.error || "Dados inválidos";
      }

      return data?.error || "Falha no cadastro. Tente novamente mais tarde.";
    } catch (_) {
      return "Falha no cadastro";
    }
  };

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    try {
      const response = await registerAPI(profileImage ?? null, name, email, password);
      // Cadastro OK
      navigate(from, { replace: true });
    } catch (err) {
      const msg = extractErrorMessage(err);
      setMessage(msg);
      errRef.current?.focus();
    }
  }

  return (
    <div className="register-form">
      <p
        ref={errRef}
        className={message ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {message}
      </p>

      <h1>Registre-se</h1>

      < ProfileImageSelector onChange={(selected) => setProfileImage(selected)}/>

      <form onSubmit={handleRegister}>
        <label htmlFor="name">Usuario </label>
        <div className="email-password-container-register">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="currentColor"
          >
            <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260..."/>
          </svg>
          <input
            type="text"
            id="name-register"
            placeholder="Digite seu usuario"
            autoComplete="off"
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>

        <label htmlFor="email">email: </label>
        <div className="email-password-container-register">
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
            id="email"
            placeholder="Digite seu email"
            ref={userRef}
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <label htmlFor="password">Password: </label>
        <div className="email-password-container-register" id="password-container-register">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M252.31-100q-29.92 0-51.12-21.19Q180-142.39 180-172.31v-375.38q0-29.92 21.19-51.12Q222.39-620 252.31-620H300v-80q0-74.92 52.54-127.46Q405.08-880 480-880q74.92 0 127.46 52.54Q660-774.92 660-700v80h47.69q29.92 0 51.12 21.19Q780-577.61 780-547.69v375.38q0 29.92-21.19 51.12Q737.61..."/>
            </svg>

            <input
              type={showPassword ? "text" : "password"}
              id="password-register"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M630.92-441.08 586-486q9-49.69-28.35-89.35Q520.31-615 466-606l-44.92-44.92q13.54-6.08 27.77-9.12 14.23-3.04 31.15-3.04 68.08 0 115.58 47.5T643.08-500q0 16.92-3.04 31.54-3.04 14.61-9.12 27.38Zm127.23 124.46L714-358q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-5..."/>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-25..."/>
                </svg>
              )}
            </button>
        </div>

        <button type="submit">Registrar</button>
      </form>

      <p className="register-container-register">
        Já tem uma conta? <span><Link to="/">Login</Link></span>
      </p>
    </div>
  );
}
