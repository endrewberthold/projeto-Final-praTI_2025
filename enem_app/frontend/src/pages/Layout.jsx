import React from "react";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div>
      {/* here it will render the Login or register pages */}
      <Outlet />
    </div>
  );
}
