import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

//export default AuthContext;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authData = {
    // Adicionar um campo para persistir o accessToken na aplicação!
    //user,
    //setUser,
    accessToken,
    setAccessToken,
    //isLoggedIn,
    //setIsLoggedIn,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
}
