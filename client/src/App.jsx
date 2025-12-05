import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "./components/Global/Navbar";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import { Home } from "./pages/home/Home";
import { Footer } from "./components/Global/Footer";
import Login from "./pages/auth/Login";
import CartPage from "./pages/cart/CartPage";
import Checkout from "./pages/checkout/Checkout";
import OrdersPage from "./pages/orders/orders";
import OrderDetails from "./pages/orders/order-details";
import ReviewsPage from "./pages/orders/reviews";
import Listings from "./pages/listings/listings";
import ListingDetails from "./pages/listings/listing-details";

export const App = () => {
    const { user, logout, isAuthenticated } = useAuth();

    const location = useLocation().pathname.replace("/", "");
    const login = location === "login" || location === "signup";

    const username = user ? user.username : null;

    return (
        <div className="app">
            {!login && <Navbar user={user} logout={logout} />}

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Login />} />
                    <Route path="/cart" element={<CartPage user={user}/>} />
                    <Route path="/checkout" element={<Checkout user={user}/>} />
                    <Route path="/orders" element={<OrdersPage user={user} />} />
                    <Route path="/orders/:orderId" element={<OrderDetails />} />
                    <Route path="/review" element={<ReviewsPage user={user}/>} />
                    <Route path="/listings" element={<Listings />}/>
                    <Route path="/listing/:listingId" element={<ListingDetails user={user}/>}/>
                </Routes>
            </main>

            {!login && <Footer isAuthenticated={isAuthenticated} username={username} />}
        </div>
    );
}