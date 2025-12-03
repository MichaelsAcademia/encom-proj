import "./OutItem.css";

export default function OutItem({ item }) {
    const {
        quantity,
        priceAtAdd,
        listingId
    } = item;

    return (
        <div className="checkout-item">
            <div className="item-name-qty">
                <p>{listingId?.title}</p>
                <span>x{quantity}</span>
            </div>
            <strong>${(priceAtAdd * item.quantity).toFixed(2)}</strong>
        </div>
    );
}