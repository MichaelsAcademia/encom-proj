import OutItem from "../../components/checkout/OutItem";
import "./checkout.css";

export default function Checkout() {
    const cart = JSON.parse(localStorage.getItem("lastCart")) || null;

    const total = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

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
                    <button className="place-order-btn">Place Order</button>
                </aside>
            </div>
        </div>
    );
}