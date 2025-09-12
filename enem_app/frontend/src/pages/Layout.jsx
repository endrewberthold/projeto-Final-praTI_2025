import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      {/* <h1>Enter Page</h1>
      <p>Irá renderizar login ou registro</p> */}
      <Outlet />
    </div>
  );
}
