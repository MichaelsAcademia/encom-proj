import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../../components/cart/CartItem";
import "./cart.css";

export default function CartPage({ user }) {
    const navigate = useNavigate();

    const userId = user?.id;

    const [cart, setCart] = useState({
        items: []
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

  // Fetch cart
    const loadCart = async () => {
        if (!user || !user.username) {
            setError("You must be logged in to view your cart.");
            setLoading(false);
            return;
        }

        console.log("Fetching cart for user ID:", userId);

        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("encomToken");
            const res = await fetch(`/api/v1/carts/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
            });

            if (!res.ok) throw new Error("Failed to fetch cart");

            const data = await res.json();
            setCart(data);

            console.log("Cart data:", data);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError("Unable to load your cart.");
        }

        setLoading(false);
    };


    useEffect(() => {
        loadCart();
    }, [userId]); // run whenever the user object changes

    useEffect(() => {
        localStorage.setItem("lastCart", JSON.stringify(cart));
    }, [cart]); // update lastCart in localStorage whenever cart changes

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;
        setUpdating(true);

        try {
            const res = await fetch(
                `/api/v1/carts/${userId}/items/${itemId}`,
                {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("encomToken")}`
                },
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
            `/api/v1/carts/${userId}/items/${itemId}`,
            { method: "DELETE",
            headers: {
        "Authorization": `Bearer ${localStorage.getItem("encomToken")}`
        }
            }
        );

        if (!res.ok) throw new Error("Failed to remove item");
        await loadCart();
        } catch (err) {
        console.error(err);
        setError("Could not remove item.");
        }

        setUpdating(false);
    };

    const subtotal = cart.items.reduce((sum, item) => sum + item.quantity * item.priceAtAdd, 0);

    return (
        <div className="cart-container">
            <h1 className="cart-title">Your Cart {}</h1>
            <div className="divider" />
            {(cart.items.length === 0 && !loading) && (
                    <p className="empty-cart">Your cart is empty.</p>
            )}
            {
                (loading && !updating) && <p className="loading">Loading your cart...</p>
            }
            {
                error && <p className="error">{error}</p>
            }
            <div className="cart">
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <>
                            <CartItem key={item._id} item={item} updateQuantity={updateQuantity} removeItem={removeItem}/>
                        </>
                    ))}
                </div>

                <aside className="sidebar">
                    <h3>Subtotal ({cart.items.length} items):</h3>
                    <h2>${subtotal.toFixed(2)}</h2>

                    <button
                        className="checkout-btn"
                        disabled={updating}
                        onClick={() => {
                            localStorage.setItem("lastCart", JSON.stringify(cart));
                            navigate("/checkout");
                        }}
                    >
                        Proceed to Checkout
                    </button>
                </aside>
            </div>
        </div>
    );
}