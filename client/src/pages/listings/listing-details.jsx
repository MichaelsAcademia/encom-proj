import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ListingCard from '../../components/listingCard';
import "./listing-details.css";

export default function ListingDetails({ user }) {
    const { listingId } = useParams();

    const [listing, setListing] = useState({
        title: '',
        description: '',
        price: 0,
        category: '',
        sellerId: '',
        images: [],
        status: '',
        quantity: 0,
        createdAt: '',
        updatedAt: ''
    });
    const [seller, setSeller] = useState({
        username: '',
        picture: '',
        rating: 0
    });
    const [sellerListings, setSellerListings] = useState([]);
    const [similarListings, setSimilarListings] = useState([]);

    const [cartBtnLbl, setCartBtnLbl] = useState("Add to Cart");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const dateFormat = (dateString) => {
        const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString("en-GB", options);
    }

    const handleCartAdd = async () => {
        // console.log(user)
        const token = localStorage.getItem('encomToken');

        if (!user.id || !user.username || !user.email || !token) {
            alert('Please log in to add items to your cart.');
            return;
        }

        try {
            const response = await axios.put(
                `/api/v1/carts/?userId=${user.id}`,
                {
                    items: [{
                        listingId: listingId,
                        quantity: 1,
                        priceAtAdd: listing.price
                    }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('Item added to cart:', response);

            setCartBtnLbl("Added!");

            setTimeout(() => {
                setCartBtnLbl("Add to Cart");
            }, 2000);
        } catch (err) {
            console.error('Failed to add item to cart.');
            console.log(err);
        }
    }

    useEffect(() => {
        // console.log("Listing ID:", listingId);

        // Fetch listing details from API
        const fetchListingDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/listings/${listingId}`);
                setListing(response.data);

                // console.log("Listing Data:", response.data);
            } catch (err) {
                setError('Failed to fetch listing details.');
                console.log(err);
            }
        }

        fetchListingDetails();

        // Fetch seller details
        const fetchSellerDetails = async () => {
            try {
                const response = await axios.get(`/api/v1/users/seller/${listing.sellerId}?basic=true`);
                setSeller(response.data.seller);

                // console.log("Seller Data:", response.data.seller);
            } catch (err) {
                console.error('Failed to fetch seller details.');
                console.log(err);
            }
        }

        // Only fetch if sellerId is available
        if (listing.sellerId) fetchSellerDetails();

        // Fetch sellers other listings (max 8)
        const fetchSellersOtherListings = async () => {
            try {
                const response = await axios.get(`/api/v1/listings?seller=${listing.sellerId}&limit=8`);

                // Exclude the current listing from seller's other listings
                const filteredListings = response.data.listings.filter(item => item._id !== listingId);

                setSellerListings(filteredListings);

                // console.log("Seller's Other Listings:", response.data.listings);
            } catch (err) {
                console.error('Failed to fetch seller\'s other listings.');
                console.log(err);
            }
        }

        // Only fetch if sellerId is available
        if (listing.sellerId) fetchSellersOtherListings();

        // Fetch similar listings (max 8)
        const fetchSimilarListings = async () => {
            try {
                const response = await axios.get(`/api/v1/listings?category=${listing.category}&limit=8`);

                // Exclude the current listing from similar listings
                const filteredListings = response.data.listings.filter(item => item._id !== listingId);

                setSimilarListings(filteredListings);

                // console.log("Similar Listings:", response.data.listings);
            } catch (err) {
                console.error('Failed to fetch similar listings.');
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        // Only fetch if category is available
        if (listing.category) fetchSimilarListings();
    }, [listingId, listing.sellerId, listing.category]);

    return (
        <div className='listing-container'>
            <div className='listing-main-details'>
                <div className='listing-images'>
                    <img src={ listing.images.length > 0 ? listing.images[0] : `https://placehold.co/400?text=${listing.title}`}/>
                </div>
                <div className='listing-info'>
                    <div className='listing-title-seller'>
                        <h2>{listing.title}</h2>
                        <div className='listing-seller'>
                            <img src={ seller.picture ? seller.picture : `https://placehold.co/200x300?text=${seller.username.charAt(0).toUpperCase()}`} />
                            <p>{seller.username.charAt(0).toUpperCase() + seller.username.slice(1)}</p>
                        </div>
                    </div>
                    <div className='listing-price-action'>
                        <p className='listing-price'>$ {listing.price.toFixed(2)}</p>
                        <button
                            className='cart-btn'
                            onClick={handleCartAdd}
                        >
                            {cartBtnLbl}
                        </button>
                    </div>
                </div>
            </div>
            <div className='listing-sub-details'>
                <h2>Details</h2>
                <div className='listing-description'>
                    <p>{listing.description}</p>
                </div>
                <div className='listing-add-info'>
                    <div className='add-info'>
                        <div className='info-item'>
                            <h3>Price</h3>
                            <p><span>*</span> ${listing.price.toFixed(2)}</p>
                        </div>
                        <div className='info-item'>
                            <h3>Availability</h3>
                            <p>{listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}</p>
                        </div>
                        <div className='info-item'>
                            <h3>Category</h3>
                            <p>{listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}</p>
                        </div>
                    </div>
                    <div className='add-info'>
                        <div className='info-item'>
                            <h3>Date Added</h3>
                            <p>{dateFormat(listing.createdAt)}</p>
                        </div>
                        <div className='info-item'>
                            <h3>Last Updated</h3>
                            <p>{dateFormat(listing.updatedAt)}</p>
                        </div>
                    </div>
                    <div className='disclaimer'>
                        <p>* Listed price does not include shipping</p>
                    </div>
                </div>
            </div>
            {
                sellerListings.length > 0 &&
                <div className='seller-listings'>
                    <h2>More From Seller</h2>
                    <div className='listings-grid'>
                        {
                            sellerListings &&
                            sellerListings.map((item) => (
                                <ListingCard key={item._id} item={item} />
                            ))
                        }
                    </div>
                </div>
            }
            {
                similarListings.length > 0 &&
                <div className='similar-listings'>
                    <h2>Similar Listings</h2>
                    <div className='listings-grid'>
                        {
                            similarListings &&
                            similarListings.map((item) => (
                                <ListingCard key={item._id} item={item} />
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}