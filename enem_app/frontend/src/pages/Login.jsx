import React from "react";
import LoginForm from "../components/LoginForm";
import FormularioRegistro from "../components/FormularioRegistreSe";
import "../styles/pages/TelaLogin.sass";

export default function TelaLogin() {
  return (
    <div className="login-page">
      <div className="lado-banner">
      </div>
      <div className="lado-formulario-login">
        <LoginForm />
      </div>
    </div>
  );
}
