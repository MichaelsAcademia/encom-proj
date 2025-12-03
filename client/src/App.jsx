import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Global/Navbar.jsx";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { Home } from "./pages/home/Home.jsx";
import { Footer } from "./components/Global/Footer";
import Login from "./pages/auth/Login.jsx";
import CartPage from "./pages/cart/CartPage.jsx";
import Checkout from "./pages/checkout/Checkout.jsx";
import OrdersPage from "./pages/orders/orders.jsx";
import OrderDetails from "./pages/orders/order-details.jsx";
import ReviewsPage from "./pages/orders/reviews.jsx";

export const App = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const location = useLocation().pathname.replace("/", "");
    const login = location === "login" || location === "signup";

    const username = user ? user.username : null;

    console.log(`Current user in Home: ${username}`);

    return (
        <div className="app">
            {!login && <Navbar user={user} logout={logout} />}

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Login />} />
                    <Route path="/cart" element={<CartPage user={user}/>} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/orders/:orderId" element={<OrderDetails />} />
                    <Route path="/review" element={<ReviewsPage />} />
                </Routes>
            </main>

            {!login && <Footer isAuthenticated={isAuthenticated} username={username} />}
        </div>
    );
}