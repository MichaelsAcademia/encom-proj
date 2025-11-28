// client/src/App.jsx
import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";

import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import CartPage from "./pages/cart/CartPage";
import Checkout from "./pages/checkout/Checkout";


import { useAuth, AuthContext } from "./context/AuthContext";

// Temp home component
function Home() {
  const { user } = useAuth();
  const { logout } = useAuth();

  const username = user ? user.username : null;

  console.log("Current user in Home:", username);

  return (
    <>
      <nav>
        <NavLink to="/login">Login</NavLink> {" "}
        <NavLink to="/signup">Sign Up</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
      {username && <button onClick={logout}>Log Out</button>}
      <h1>Home Page</h1>
      {username ? <p>Welcome, {user.username}!</p> : <p>Please log in.</p>}
    </>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
    </>
  );
}