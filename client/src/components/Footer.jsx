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
                    <button>Sign In</button>
                    <button>Cart</button>
                    <button>Order History</button>
                    <button>Account Settings</button>
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
                <h1>Terms & Conditions</h1>
            </div>
        </div>
    );
}