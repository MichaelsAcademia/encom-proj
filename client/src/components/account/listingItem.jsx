import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './listingItem.css';
import { useEffect } from "react";

export default function ListingItem({ listing }) {
    const navigate = useNavigate();
    const token = localStorage.getItem('encomToken');

    const {
        _id,
        title,
        price,
        images,
    } = listing;

    const handleDelete = async () => {
        if (!token) {
            alert("You must be logged in to delete a listing.");
            return;
        }

        try {
            const response = await axios.delete(`/api/v1/listings/${_id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('encomToken')}`
                }
            });

            if (response.ok) {
                throw new Error('Failed to delete listing.');
            }

            navigate(0); // Refresh the page to reflect changes
        } catch (error) {
            console.error("Error deleting listing:", error);
            alert("Failed to delete the listing. Please try again.");
        }
    };

    return (
        <div className="listing-list-item">
            <div className="listing-item-content" onClick={() => navigate(`/listing/${_id}`)}>
                <div className="listing-image">
                    <img src={images.length > 0 ? images[0] : `https://placehold.co/200?text=${title}`}/>
                </div>
                <div className="listing-details">
                    <h3>{title}</h3>
                    <p>Price: ${price}</p>
                </div>
            </div>
            <div className="listing-item-actions">
                <Link to={`/account/listings/edit?id=${_id}`} className="link">
                    Edit
                </Link>
                <button
                    className="link"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}