import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { MobileSideModal } from "./components/MobileSideModal.jsx";
import { Footer } from "./components/Footer.jsx";
import { useAuth, AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/auth/Login";

export const App = () => {
    const { user } = useAuth();
    const { logout } = useAuth();

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

            <Navbar handleMobileSideModal={handleMobileSideModal} user={user} logout={logout} />
            
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