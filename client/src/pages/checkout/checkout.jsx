import "./checkout.css";

export default function Checkout() {
    const cart = JSON.parse(localStorage.getItem("lastCart")) || null;

    if (!cart) return <h2>Your cart is empty.</h2>;

    const total = cart.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0);

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
                    <button className="place-order-btn">Place Order</button>
                </aside>
            </div>
        </div>
    );
}
