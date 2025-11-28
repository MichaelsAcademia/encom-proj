import "./CartItem.css";

export default function CartItem({ item, updateQuantity, removeItem }) {
    return (
        <div className="cart-item">

            {/* PRODUCT IMAGE */}
            <img
                src={item.listingId?.images?.[0] || "https://via.placeholder.com/100"}
                alt={item.listingId?.title}
                className="cart-item-img"
            />

            {/* PRODUCT DETAILS + CONTROLS */}
            <div className="cart-item-details">
                <h3>{item.listingId?.title}</h3>
                <p className="price-tag">${item.priceAtAdd.toFixed(2)}</p>

                <div className="qty-controls">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}>−</button>

                    <span>{item.quantity}</span>

                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                        +
                    </button>

                    <button className="remove-item-btn" onClick={() => removeItem(item._id)}>
                        Remove
                    </button>
                </div>
            </div>
        </div>
    );
}
