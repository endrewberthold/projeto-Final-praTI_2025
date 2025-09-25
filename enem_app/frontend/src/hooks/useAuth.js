import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider";

export default function useAuth() {
  const { auth } = useContext(AuthContext);
  //console.log("AUTH: ", auth);

  useDebugValue(auth, (auth) =>
    auth?.user?.name ? "Logged In" : "Logged Out"
  );
  return useContext(AuthContext);
}
