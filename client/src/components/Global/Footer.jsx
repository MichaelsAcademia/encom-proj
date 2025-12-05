import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Footer.css";

export const Footer = ({ isAuthenticated, username }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        console.log("Footer login click");
        console.log("isAuthenticated:", isAuthenticated);
        console.log("username:", username);

        if (!isAuthenticated) {
            navigate("/login")
            return;
        };

        alert(`You are already logged in as ${username}`);
    }

    useEffect(() => {
    }, [isAuthenticated, username]);

    return (
        <div className="footer">
            <div className="footer-grid">
                <div className="footer-grid-item">
                    <h2>Shop</h2>
                    <Link to="/listings">All Products</Link>
                    <Link to="/listings?page=1&sort=new">New Arrivals</Link>
                </div>
                <div className="footer-grid-item">
                    <h2>Sell</h2>
                    <Link to="">Start Selling</Link>
                    <Link to="/faq?seller=true">Seller F.A.Q</Link>
                </div>
                <div className="footer-grid-item">
                    <h2>Account</h2>
                    <Link onClick={handleLoginClick}>Sign In</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/orders">Order History</Link>
                    <Link to="/account">Account Settings</Link>
                </div>
                <div className="footer-grid-item">
                    <h2>Contact Us</h2>
                    <a href="mailto:test@email.com?subject=Fake%20Email&body=Don%27t%20use%20this%20email">
                        Email Support
                    </a>
                    <a href="">Phone Support</a>
                    <Link to="/faq">Frequently Asked Questions</Link>
                    <Link to="/tos">Terms and Conditions</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <h1>&copy; Encom 2025</h1>
            </div>
        </div>
    );
}