import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ListingItem from '../../components/account/listingItem';
import './listings-list.css';

export default function ListingsList({ user }) {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        // Fetch user's listings from the server
        const fetchListings = async () => {
            try {
                const response = await axios.get(`/api/v1/listings?seller=${user.id}`);
                setListings(response.data.listings);

                console.log('Fetched listings:', response.data);
            } catch (err) {
                console.error('Failed to fetch listings:', err);
            }
        }

        if ((user && user.id) && listings.length <= 0) fetchListings();
    }, [user.id]);

    return (
        <div className="listings-list-page">
            <div className="list-title">
                <h1>Your Listings</h1>
            </div>
            <div className='divider' />
            <div className="btn-info-container">
                <p>
                    {listings.length} Total Listings
                </p>
                <Link to="/account/listings/new" className="link create-btn">
                    Create New Listing
                </Link>
            </div>
            <div className="list-container">
                {listings.length === 0 ? (
                    <p className='font-size: 2rem;'>You have no listings yet.</p>
                ) : (
                    listings.map((listing, index) => (
                        <>
                            <ListingItem key={listing._id} listing={listing} />
                            {
                                index < listings.length - 1 &&
                                <div className="divider-item"/>
                            }
                        </>
                    ))
                )}
            </div>
        </div>
    )
}