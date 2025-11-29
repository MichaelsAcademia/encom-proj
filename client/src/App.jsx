import "./App.css";
import { useState,  } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar.jsx";
import { MobileSideModal } from "./components/MobileSideModal.jsx";
import { useAuth, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { Home } from "./pages/Home.jsx";
import { Footer } from "./components/Footer.jsx";
import Login from "./pages/auth/Login";

export const App = () => {
    const { user, logout } = useAuth();

    const location = useLocation().pathname.replace("/", "");
    const login = location === "login" || location === "signup";

    console.log("location:", location);
    console.log("in login?", login);

    const username = user ? user.username : null;

    console.log(`Current user in Home: ${username}`);


    const [isMobileSideModalOpen, setIsMobileSideModalOpen] = useState(false);
    const handleMobileSideModal = () => {
        setIsMobileSideModalOpen(!isMobileSideModalOpen);
    }

    return (
        <div className="app">
            {isMobileSideModalOpen && (
                <MobileSideModal handleModal={handleMobileSideModal} user={user} logout={logout} />
            )}

            {!login && <Navbar handleMobileSideModal={handleMobileSideModal} user={user} logout={logout} />}

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Login />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </main>

            {!login && <Footer />}
        </div>
    );
}