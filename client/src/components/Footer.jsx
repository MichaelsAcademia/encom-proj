import { useNavigate, Link } from "react-router-dom";

import "./Footer.css";

export const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-grid">
                <div className="footer-grid-item">
                    <h2>Shop</h2>
                    <button>All Products</button>
                    <button>New Arrivals</button>
                    <button>Categories</button>
                </div>
                <div className="footer-grid-item">
                    <h2>Sell</h2>
                    <button>Start Selling</button>
                    <button>Seller FAQ</button>
                    <button>Seller Guidelines</button>
                </div>
                <div className="footer-grid-item">
                    <h2>Account</h2>
                    <Link to="/login" className="link">Sign In</Link>
                    <Link to="/cart" className="link">Cart</Link>
                    <Link to="/orders" className="link">Order History</Link>
                    <Link to="/account" className="link">Account Settings</Link>
                </div>
                <div className="footer-grid-item">
                    <h2>Contact Us</h2>
                    <button>Email Support</button>
                    <button>Phone Support</button>
                    <button>FAQ</button>
                    <button>Terms & Conditions</button>
                </div>
            </div>
            <div className="footer-bottom">
                <h1>&copy; Encom 2025</h1>
            </div>
        </div>
    );
}