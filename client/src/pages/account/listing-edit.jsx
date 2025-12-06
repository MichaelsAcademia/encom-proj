import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import './listing-edit.css';
import { User } from "@phosphor-icons/react";

export default function ListingEdit({ user }) {
    const navigate = useNavigate();
    const token = localStorage.getItem("encomToken");

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [listingData, setListingData] = useState({
        title: "",
        description: "",
        price: 0,
        category: "",
        images: [],
        status: "available",
        quantity: 1
    });

    const handleChange = (e) => {
        setListingData({ ...listingData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Listing Submitted:", listingData);

        if (id) {
            // Update existing listing
            try {
                const response = await axios.put(`/api/v1/listings/${id}`,
                    listingData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Listing updated:", response.data);
                return navigate(`/listing/${id}`);
            } catch (error) {
                console.error("Error updating listing:", error);
            }
        }

        // Create new listing
        try {
            const response = await axios.post(`/api/v1/listings`,
                {
                    ...listingData,
                    sellerId: user.id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Listing created:", response.data);

            navigate(`/listing/${response.data._id}`);
        } catch (error) {
            console.error("Error creating listing:", error);
        }

    };

    useEffect(() => {
        if (!id) return;

        // Fetch listing data by ID and populate state
        const fetchListingData = async () => {
            try {
                const response = await axios.get(`/api/v1/listings/${id}`);

                if (response.ok) throw new Error("Failed to fetch listing data");

                setListingData(response.data);
            } catch (error) {
                console.error("Error fetching listing data:", error);
            }
        };
        fetchListingData();
    }, [id]);

    return (
        <div className="listing-edit-page">
            <h1>{id ? "Edit" : "New"} Listing</h1>
            <div className='divider' />

            <form onSubmit={handleSubmit} className="listing-form">
                <div>
                    <label>Title</label>
                    <input name="title" value={listingData.title} onChange={handleChange} />
                </div>
                <br /><br />
                <div>
                    <label>Description</label>
                    <textarea name="description" value={listingData.description} onChange={handleChange} />
                </div>
                <br /><br />
                <div>
                    <label>Price</label>
                    <input type="number" name="price" value={listingData.price} onChange={handleChange} />
                </div>
                <br /><br />
                <div>
                    <label>Category</label>
                    <input name="category" value={listingData.category} onChange={handleChange} />
                </div>
                <br /><br />
                <div>
                    <label>Quantity</label>
                    <input type="number" name="quantity" value={listingData.quantity} onChange={handleChange} />
                </div>
                <br /><br />
                <div className="form-actions">
                    <button type="submit">{id ? "Save" : "Create"} Listing</button>
                </div>
            </form>
        </div>
    );
}