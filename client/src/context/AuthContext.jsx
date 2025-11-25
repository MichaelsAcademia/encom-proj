// client/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

// Create the context object
export const AuthContext = createContext();

// Provider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(sessionStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(sessionStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);

  // Called after successful login
  const login = (userData, jwtToken) => {
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", jwtToken);

    setUser(userData);
    setToken(jwtToken);
  };

  // Called when user clicks Sign Out
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setToken(null);
  };

  // On page refresh, restore data from sessionStorage
  useEffect(() => {
    setLoading(true);
    const savedUser = sessionStorage.getItem("user");
    const savedToken = sessionStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // Value shared with all components
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
