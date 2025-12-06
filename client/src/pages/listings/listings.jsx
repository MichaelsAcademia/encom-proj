import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
// import { XIcon, CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"; // Icons can be used for filters later
import ListingCard from "../../components/listingCard";
import "./listings.css";

export default function ListingsPage() {
    const [searchParams] = useSearchParams();
    const pageParam = Math.max(1, searchParams.get("page") || 1);
    const sortParam = searchParams.get("sort") || null;
    const newSort = sortParam === "new";

    const [totalListings, setTotalListings] = useState(0);
    const [listings, setListings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const LISTINGS_PER_PAGE = 20;
    const offset = (pageParam - 1) * LISTINGS_PER_PAGE;
    const startingIndex = offset + 1;
    const endIndex = Math.min(totalListings, startingIndex + LISTINGS_PER_PAGE - 1)

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await fetch(`/api/v1/listings?limit=${LISTINGS_PER_PAGE}&offset=${startingIndex - 1}&sort=${newSort}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch listings");
                }
                const data = await response.json();
                setListings(data.listings);
                setTotalListings(data.total);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();

        // console.log(listings)
    }, [startingIndex]);

    const handlePage = (invalid) => {
        if (invalid) return;

        setListings([]);
        setLoading(true);
        setError(null);
    }

    // scroll to top whenever the page changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pageParam]);

    return (
        <div className="listings-container">
            <div className="listings-header">
                <div>
                    <h3>Listings</h3>
                    <p>Results {startingIndex} - {endIndex} of {totalListings}</p>
                    {/* Filters will go here if time allows */}
                </div>
            </div>
            {
                loading && (
                    <div className="loading-container">
                        <div className="loading-spinner" />
                        <p>Loading...</p>
                    </div>
                )
            }

            <div className="listings-grid">
                {listings.map((listing) =>
                    <ListingCard key={listing._id} item={listing} />
                )}
            </div>
            <div className="listings-pagination">
                <Link
                    to={`/listings?page=${pageParam == 1 ? 1 : (pageParam - 1)}`}
                    data-disabled={pageParam === 1}
                    className="page-button"
                    onClick={() => handlePage(pageParam === 1)}
                >
                    {"<"}
                </Link>
                <span>Page {pageParam}</span>
                <Link
                    to={`/listings?page=${endIndex === totalListings ? pageParam : pageParam + 1}`}
                    data-disabled={endIndex === totalListings}
                    className="page-button"
                    onClick={() => handlePage(endIndex === totalListings)}
                >
                    {">"}
                </Link>
            </div>
        </div>
    )
}