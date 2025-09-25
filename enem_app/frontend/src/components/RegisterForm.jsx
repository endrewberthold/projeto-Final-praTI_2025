import React, { useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { registerAPI } from "../services/userServices";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await registerAPI(name, email, password);

      console.log(response);
      navigate(from, { replace: true });
    } catch (err) {
      console.log("ERRO ON REGISTER: ", err);
    }
  }

  return (
    <div>
      <h1>RegisterForm</h1>

      <form onSubmit={handleRegister}>
        <label htmlFor="name">User Name: </label>
        <input
          type="text"
          id="name"
          autoComplete="off"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">email: </label>
        <input
          type="email"
          id="email"
          ref={userRef}
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button>Register</button>
        <div>
          <input
            type="checkbox"
            id="persist"
            // onChange={togglePersist}
            // checked={persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>
      </form>
      <p>
        Already has an Account?
        <br />
        <span>
          <Link to="/">Sign In</Link>
        </span>
      </p>
    </div>
  );
}
