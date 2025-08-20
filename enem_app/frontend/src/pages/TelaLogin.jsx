import React from "react";
import FormularioLogin from "../components/FormularioLogin";
import "../styles/pages/TelaLogin.sass";

function TelaLogin() {
  return (
    <>
      <div id="lado-banner"></div>
      <div id="lado-formulario-login">
        <FormularioLogin />
      </div>
    </>
  );
}

export default TelaLogin;
