import React from "react";
import FormularioLogin from "../components/FormularioLogin";
import FormularioRegistro from "../components/FormularioRegistreSe";
import '../styles/pages/TelaLogin.sass';

function TelaLogin() {
  return (
    <>
      <div id="lado-banner"></div>
      <div id="lado-formulario-login">
       <FormularioRegistro />

      </div>
    </>
  );
}

export default TelaLogin;