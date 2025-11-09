import React from "react";
import RegisterForm from "../components/RegisterForm";
import "../styles/pages/RegisterPage.sass";


export default function RegisterPage() {
  return (
    <div className="register-page">
      <div className="banner-side">
        <img src="/login.png" alt="Ilustração de registro" className="banner-image" />
      </div>

      <div className="register-form-side">
        <RegisterForm />
      </div>
    </div>
  );
}
