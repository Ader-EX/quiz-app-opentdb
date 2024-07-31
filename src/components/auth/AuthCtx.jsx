import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedAuthState = localStorage.getItem("isAuthenticated");
    return savedAuthState === "true";
  });

  const login = (username, password) => {
    console.log("Logging in with", username, password);
    if (username == "admin" && password == "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
