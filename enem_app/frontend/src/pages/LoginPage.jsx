import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/pages/LoginPage.sass";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="banner-side">
        <img src="/login.png" alt="Ilustração de login" className="banner-image" />
      </div>

      <div className="login-form-side">
        <LoginForm />
      </div>
    </div>
  );
}
