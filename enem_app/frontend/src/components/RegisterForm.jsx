import React, { useRef, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const REGISTER_URL = "/api/auth/register";

export default function RegisterForm() {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const userRef = useRef();

  async function handleRegister(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        REGISTER_URL,
        JSON.stringify({ name, email, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log(response);
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
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">email: </label>
        <input
          type="email"
          id="email"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label htmlFor="password">Password: </label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
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
