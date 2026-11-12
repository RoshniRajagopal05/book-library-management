import { createContext, useContext, useEffect, useState } from "react";
import { setAuthToken, setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Register unauthorized response handler when AuthProvider mounts
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthToken(null);
      setToken(null);
      setUser(null);
    });

    return () => {
      setUnauthorizedHandler(null);
    };
  }, []);

  // Login user
  function login(accessToken, userData) {
    setAuthToken(accessToken);
    setToken(accessToken);
    setUser(userData);
  }

  // Update user information
  function updateUser(userData) {
    setUser(userData);
  }

  // Logout user
  function logout() {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        updateUser,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}