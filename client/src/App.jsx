import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// AUTH
import Login from "./pages/auth/Login";

// HOME
import { Home } from "./pages/home/Home";

// GLOBAL
import { Footer } from "./components/Global/Footer";
import { Navbar } from "./components/Global/Navbar";

// CART & CHECKOUT
import CartPage from "./pages/cart/CartPage";
import Checkout from "./pages/checkout/Checkout";

// ORDERS & REVIEWS
import OrdersPage from "./pages/orders/orders";
import OrderDetails from "./pages/orders/order-details";
import ReviewsPage from "./pages/orders/reviews";

// LISTINGS
import Listings from "./pages/listings/listings";
import ListingDetails from "./pages/listings/listing-details";

// ACCOUNT LISTINGS
import ListingEdit from "./pages/account/listing-edit";
import ListingsList from "./pages/account/listings-list";

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
                    <Route path="/account/listings" element={<ListingsList user={user}/>} />
                    <Route path="/account/listings/new" element={<ListingEdit user={user}/>} />
                    <Route path="/account/listings/edit" element={<ListingEdit />} />
                </Routes>
            </main>

            {!login && <Footer isAuthenticated={isAuthenticated} username={username} />}
        </div>
    );
}