// client/src/App.jsx
import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Simple Home page (you can later replace with your real landing page)
function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Welcome to ENCOM</h1>
      {user ? (
        <p>You are logged in as <strong>{user.name || user.email}</strong>.</p>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </div>
  );
}

// Navbar component
function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
    marginRight: "1rem"
  });

  const handleLogoutClick = () => {
    logout();
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1rem",
        backgroundColor: "#222",
        color: "#fff"
      }}
    >
      <div>
        <span style={{ fontWeight: "bold", marginRight: "1rem" }}>
          ENCOM
        </span>

        <NavLink to="/" style={activeStyle}>
          Home
        </NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" style={activeStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={activeStyle}>
              Register
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <NavLink to="/profile" style={activeStyle}>
              My Profile
            </NavLink>
          </>
        )}
      </div>

      <div>
        {isAuthenticated && (
          <>
            <span style={{ marginRight: "1rem" }}>
              {user?.name || user?.email}
            </span>
            <button onClick={handleLogoutClick}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* You can later add more routes like /profile, /listings, etc. */}
      </Routes>
    </>
  );
}
