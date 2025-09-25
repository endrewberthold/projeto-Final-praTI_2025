import React from "react";
import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import { loginAPI } from "../services/userServices";

export default function LoginForm() {
  const { setAuth, persist, setPersist, setAccessToken } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("USER: ", email);

    try {
      const response = await loginAPI(email, password);

      //console.log(JSON.stringify(response?.data));
      //console.log("DATA: :", response?.data);
      //console.log("RESPONSE: :", response?.data.user.role);

      const accessToken = response?.data?.accessToken;
      const role = response?.data?.user.role;

      setAccessToken(accessToken);
      setAuth({ email, password, role, accessToken });
      setEmail("");
      setPassword("");
      navigate(from, { replace: true });

      console.log("FROM: ", from);
    } catch (err) {
      if (!err?.response) {
        setMessage("No Server Response");
      } else if (err.response?.status === 400) {
        setMessage("Missing emailname or Password");
      } else if (err.response?.status === 401) {
        setMessage("Unauthorized");
      } else {
        setMessage("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section>
      <p
        ref={errRef}
        className={message ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {message}
      </p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">email:</label>
        <input
          type="email"
          id="email"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />
        <button>Sign In</button>
        <div>
          <input
            type="checkbox"
            id="persist"
            onChange={togglePersist}
            checked={persist}
          />
          <label htmlFor="persist">Trust This Device</label>
        </div>
      </form>
      <p>
        Need an Account?
        <br />
        <span>
          <Link to="/register">Sign Up</Link>
        </span>
      </p>
    </section>
  );
}
