import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import NavBar from "./NavBar";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  //console.log("REQUIRED: ", location);
  //console.log("AUTH: ", auth);
  //return auth?.role?.find((role) => allowedRoles?.includes(role)) ? (
  return auth?.role === "USER" ? (
    <>
      <NavBar />
      <Outlet />
    </>
  ) : auth?.accessToken ? ( //changed from user to accessToken to persist login after refresh
    <Navigate to="/dashboard" state={{ from: location }} replace />
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default RequireAuth;
