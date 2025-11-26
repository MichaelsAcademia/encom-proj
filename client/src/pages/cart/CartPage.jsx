import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cart.css";

export default function CartPage() {
    const navigate = useNavigate();

    const userId =
        localStorage.getItem("userId") || "673d5b58a7c911f92c3a8b80";

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    // Fetch cart
    const loadCart = async () => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/carts/${userId}`
            );

            if (!res.ok) throw new Error("Failed to fetch cart");

            const data = await res.json();
            setCart(data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Unable to load your cart.");
        }

        setLoading(false);
    };

    useEffect(() => {
        loadCart();
    }, []);

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        setUpdating(true);

        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/carts/${userId}/items/${itemId}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ quantity }),
                }
            );

            if (!res.ok) throw new Error("Failed to update item quantity");

            await loadCart();
        } catch (err) {
            console.error(err);
            setError("Could not update item quantity.");
        }

        setUpdating(false);
    };

    const removeItem = async (itemId) => {
        setUpdating(true);

        try {
            const res = await fetch(
                `http://localhost:3000/api/v1/carts/${userId}/items/${itemId}`,
                { method: "DELETE" }
            );

            if (!res.ok) throw new Error("Failed to remove item");

            await loadCart();
        } catch (err) {
            console.error(err);
            setError("Could not remove item.");
        }

        setUpdating(false);
    };

    if (loading) return <p className="loading">Loading cart...</p>;

    if (error) return <p className="error">{error}</p>;

    if (!cart || cart.items.length === 0)
        return <h2 className="empty">Your cart is empty.</h2>;

    const subtotal = cart.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );

    return (
        <>
            <h1 className="cart-title">Shopping Cart</h1>

            <div className="cart-container">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item._id} className="cart-item">
                            <img
                                src={item.image || "https://via.placeholder.com/100"}
                                alt={item.title}
                                className="item-image"
                            />

                            <div className="item-info">
                                <h3>{item.title}</h3>
                                <p className="price">${item.price}</p>

                                <div className="controls">
                                    <button
                                        disabled={item.quantity <= 1 || updating}
                                        onClick={() =>
                                            updateQuantity(
                                                item._id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        disabled={updating}
                                        onClick={() =>
                                            updateQuantity(
                                                item._id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        className="remove-btn"
                                        disabled={updating}
                                        onClick={() => removeItem(item._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <aside className="sidebar">
                    <h3>
                        Subtotal ({cart.items.length} items):
                    </h3>
                    <h2>${subtotal.toFixed(2)}</h2>

                    <button
                        className="checkout-btn"
                        disabled={updating}
                        onClick={() => navigate("/checkout")}
                    >
                        Proceed to Checkout
                    </button>
                </aside>
            </div>
        </>
    );
}
