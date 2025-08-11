import React from "react";
import '../styles/components/FormularioLogin.sass'

function FormularioLogin() {
  return (
    <div id="formulario-login">
      <h1>Login</h1>
      <p>
        Não tem uma conta? <b>Registre-se</b>
      </p>
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log(`Email: ${e.target.email.value} Password ${e.target.senha.value}`)
      }
      }>
        <input type="email" name="email" placeholder="Email/User" required/>
        <input type="password" name="senha" placeholder="Senha" minLength={8} maxLength={12} required/>

        <div id="auxiliares">
          <div id="checkbox">
            <input type="checkbox" />
            <label>Manter-se conectado?</label>
          </div>

          <a>Esqueceu a senha?</a>
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default FormularioLogin;
