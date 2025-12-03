import { Link } from "react-router-dom";

import "./listingCard.css";

export default function ListingCard({ item }) {

    const {
        _id,
        title,
        price,
        images
    } = item;

    const item_id = _id;

    const image = (images.length > 0) ? images[0] : "https://placehold.co/400?text=No%20Image";

    return (
        <Link to={`/listing/${item_id}`}>
            <div key={item_id} className="listing-item">
                <img src={image} />
                <h3>{title}</h3>
                <p>${price}</p>
            </div>
        </Link>
    );
}