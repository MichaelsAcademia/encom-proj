import "./Footer.css";

export const Footer = () => {
    return (
        <div className="footer">
            <div className="footer-content">
                <h2>Shop</h2>
                <button>All Products</button>
                <button>New Arrivals</button>
                <button>Categories</button>
            </div>
            <div className="footer-content">
                <h2>Sell</h2>
                <button>Start Selling</button>
                <button>Seller FAQ</button>
                <button>Seller Guidelines</button>
            </div>
            <div className="footer-content">
                <h2>Account</h2>
                <button>Sign In</button>
                <button>Cart</button>
                <button>Order History</button>
                <button>Account Settings</button>
            </div>
            <div className="footer-content">
                <h2>Contact Us</h2>
                <button>Email Support</button>
                <button>Phone Support</button>
                <button>FAQ</button>
            </div>
        </div>
    );
}