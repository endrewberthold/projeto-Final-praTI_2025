import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Dashboard from "../pages/Dashboard";
import NavBar from "./NavBar";

export default function RequireAuth() {
  const { auth } = useAuth();
  const location = useLocation();
  console.log("LOCATION REQUIRED: ", location);
  console.log(auth.accessToken);

  return auth?.accessToken ? (
    <>
      <NavBar />
      {/* <Dashboard /> */}
      <Outlet />
    </>
  ) : (
    //<Dashboard />
    <Navigate to="/" state={{ from: location }} replace />
    // <Navigate to="/dashboard" replace />
  );
}
