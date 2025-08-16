import React from "react";
import NavBar from "../components/NavBar";
import "../styles/pages/home.sass";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-container">
      <NavBar />

      <Outlet />
    </div>
  );
}
