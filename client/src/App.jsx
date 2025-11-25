// client/src/App.jsx
import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
// ❌ REMOVED → EmailEntry (no longer used)
// import EmailEntry from "./pages/EmailEntry";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

/* ---------------------------------
   HOME COMPONENT
---------------------------------- */
function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to ENCOM</h1>

      {user ? (
        <p>
          You are logged in as{" "}
          <strong>{user.username || user.name || user.email}</strong>.
        </p>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </div>
  );
}

/* ---------------------------------
   NAVBAR COMPONENT
---------------------------------- */
function Navbar() {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const activeStyle = ({ isActive }) => ({
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: isActive ? "underline" : "none",
    marginRight: "1rem",
  });

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.75rem 1rem",
        backgroundColor: "#222",
        color: "#fff",
      }}
    >
      <div>
        <span style={{ fontWeight: "bold", marginRight: "1rem" }}>ENCOM</span>

        <NavLink to="/" style={activeStyle}>
          Home
        </NavLink>

        {/* ✔ FIX: /auth removed → /login for “Get Started” */}
        <NavLink to="/login" style={activeStyle}>
          Get Started
        </NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" style={activeStyle}>
              Login
            </NavLink>
            <NavLink to="/signup" style={activeStyle}>
              Register
            </NavLink>
          </>
        )}

        {isAuthenticated && (
          <NavLink to="/profile" style={activeStyle}>
            My Profile
          </NavLink>
        )}
      </div>

      <div>
        {isAuthenticated && (
          <>
            <span style={{ marginRight: "1rem" }}>
              {user?.username || user?.name || user?.email}
            </span>
            <button onClick={logout}>Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}

/* ---------------------------------
   MAIN APP ROUTER
---------------------------------- */
export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* LOGIN PAGE handles BOTH email-entry & password login */}
        <Route path="/login" element={<Login />} />

        {/* SIGNUP PAGE */}
        <Route path="/signup" element={<Register />} />

        {/* PROTECTED PROFILE */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
