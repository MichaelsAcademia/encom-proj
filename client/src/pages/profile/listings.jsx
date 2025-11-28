import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import axios from "axios";
import "./listings.css";

export default function UserListings() {
    const navigate = useNavigate();
    const { username } = useParams();

    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);


    const getUserListings = async () => {
        // Fetch user listings from the server
        try {
            const response = await axios.get(`/api/v1/listings/seller/${username}`);

            setListings(response.data.listings);
        } catch (error) {
            console.error("Error fetching user listings:", error);
        }
    }

    const getUserRating = async () => {
        // Fetch user rating from the server
        try {
            const response = await axios.get(`/api/v1/reviews/user/${username}`);

            let userRating = 0;

            const reviewlist = response.data;

            setReviews(reviewlist);

            reviewlist.map((review) => {
                userRating += review.rating;
            });

            userRating = userRating / reviewlist.length;

            setRating(userRating.toFixed(1));
        } catch (error) {
            console.error("Error fetching user rating:", error);
        }
    }

    useEffect(() => {
        getUserRating();
        getUserListings();
    }, []);


    return (
        <div className="listings-page">
            <div className="seller-container">
                <h2>{username}'s Store</h2>
                <h4>Rating: {rating}/5</h4>
            </div>
            <div className="listings-container">
                <ul className="listings-grid">
                    {listings.map((listing) => (
                        <li className="listing-item" key={listing._id}>
                            <img src="https://placehold.co/600x400"/>
                            <h3>{listing.title}</h3>
                            <p>Price: ${listing.price}</p>
                            {listing.images && listing.images.length > 0 && (
                                <img src={listing.images[0]} alt={listing.title} width="200" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="reviews-container">
                <ul className="reviews-grid">
                    {reviews.map((review, index) => (
                        <li className="review-item" key={index}>
                            <p>Rating: {review.rating}/5</p>
                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}