import "./checkout.css";
import { useAuth } from "../../context/AuthContext"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
    const cart = JSON.parse(localStorage.getItem("lastCart")) || null;
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!cart) return <h2>Your cart is empty.</h2>;

    const total = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

    const placeOrder = async () => {
        if (!user || !user.id) {
            setError("You must be logged in to place an order.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("encomToken");
            const res = await fetch("/api/v1/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ userId: user.id }),
            });

            if (!res.ok) throw new Error("Failed to place order");

            const data = await res.json();

            localStorage.removeItem("lastCart");

            navigate("/orders");
        } catch (err) {
            console.error(err);
            setError("Failed to place the order. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="checkout-page">
            <h2>Order Summary</h2>

            <div className="checkout-container">
                <div className="checkout-items">
                    {cart.items.map((item) => (
                        <div key={item._id} className="checkout-item">
                            <p>{item.listingId?.title}</p>
                            <span>x{item.quantity}</span>
                            <strong>${(item.priceAtAdd * item.quantity).toFixed(2)}</strong>
                        </div>
                    ))}
                </div>

                <aside className="checkout-summary">
                    <h3>Total:</h3>
                    <h1>${total.toFixed(2)}</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <button
                        className="place-order-btn"
                        onClick={placeOrder}
                        disabled={loading}
                    >
                        {loading ? "Placing Order..." : "Place Order"}
                    </button>
                </aside>
            </div>
        </div>
    );
}