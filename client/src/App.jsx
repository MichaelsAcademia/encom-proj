import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";
import { useAuth, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";

export const App = () => {
    const { user } = useAuth();
    const { logout } = useAuth();

    const username = user ? user.username : null;

    console.log("Current user in Home:", username);

    return (
        <div className="app">
            <Navbar user={user} logout={logout} />
            
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Login />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}