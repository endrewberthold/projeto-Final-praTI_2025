import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/pages/LoginPage.sass";

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="banner-side"></div>

      <div className="login-form-side">
        <LoginForm />
      </div>
    </div>
  );
}
