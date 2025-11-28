import { createContext, useContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

// Custom hook (THIS is the missing export!)
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ username: null, email: null });
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("encomUser");
    if (saved) {
      setUser(JSON.parse(saved));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  function login(userData, token) {
    localStorage.setItem("encomUser", JSON.stringify(userData));
    localStorage.setItem("encomToken", token);

    setUser({
      username: userData.username,
      email: userData.email
    });
    setIsAuthenticated(true);
  }

  // Logout function
  function logout() {
    localStorage.removeItem("encomUser");
    localStorage.removeItem("encomToken");
    setUser(null);
    setIsAuthenticated(false);
  }

  // Provide data to children
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}