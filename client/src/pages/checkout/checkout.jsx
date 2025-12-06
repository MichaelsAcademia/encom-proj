import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OutItem from "../../components/checkout/OutItem";
import axios from "axios";
import "./checkout.css";

export default function Checkout({ user }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("encomToken");
    const cart = JSON.parse(localStorage.getItem("lastCart")) || null;
    const total = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

    const [placeBtn, setPlaceBtn] = useState("Place Order");

    const handlePlaceOrder = async () => {

        console.log("Placing order for user:", user);
        console.log("Cart details:", cart);

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            // Here you would typically send the order details to your server

            const res = await axios.post(
                "/api/v1/orders",
                {
                    userId: user.id,
                    items: cart.items,
                    total,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("encomToken")}`,
                    },
                }
            );

            console.log("Order placed:", res.data);

            if (res.ok) {
                throw new Error('Failed to place order.');
            }

            setPlaceBtn("Order Placed!");

            localStorage.removeItem("lastCart");

            navigate("/orders");
        } catch (error) {
            console.error("Error placing order:", error);
        }
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Order Summary</h1>
            <div className="divider" />

            <div className="checkout-container">
                <div className="checkout-items">
                    {cart.items.map((item) => (
                        <OutItem key={item._id} item={item} />
                    ))}
                </div>

                <aside className="checkout-summary">
                    <h3>Total:</h3>
                    <h1>${total.toFixed(2)}</h1>
                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                    >
                        {placeBtn}
                    </button>
                </aside>
            </div>
        </div>
    );
}