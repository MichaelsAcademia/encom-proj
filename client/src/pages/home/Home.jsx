import { useEffect, useRef, useState } from "react";
import axios from "axios";

import "./Home.css";
import ListingCard from "../../components/listingCard.jsx";

export const Home = () => {
    const [popularItems, setPopularItems] =  useState([]);

    useEffect(() => {
        // Fetch popular items from the backend API

        const fetchPopularItems = async () => {
            try {
                const response = await axios.get("/api/v1/listings/popular");
                setPopularItems(response.data);
            } catch (error) {
                console.error("Error fetching popular items:", error);
            }
        }
        fetchPopularItems();
    }, []);

    //This is just for the stats animation
    const statsRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div className="home">
            <div className="hero">
                <h1 className="hero-title">Buy. Sell. Discover.</h1>
                <h3 className="hero-subtitle">Directly From People Like You.</h3>
            </div>

            <div className="home-content">
                <div className="popular">
                    <h2 className="popular-title">Popular Items</h2>
                    <div className="popular-grid">
                        {popularItems.map((item) => (
                            <ListingCard key={item._id} item={item} />
                        ))}
                    </div>
                </div>
                <div className="shop-sell">
                    <div className="shop-sell-item left">
                        <h2>Find it. Love it. Own it.</h2>
                        <button>Shop Now</button>
                    </div>
                    <div className="shop-sell-item right">
                        <h2>List it. Ship it. Profit.</h2>
                        <button>Sell Now</button>
                    </div>
                </div>
                <div className="stats" ref={statsRef}>
                    <div className="stat-item">
                        <h2>99.5%</h2>
                        <p>Satisfaction Rate</p>
                    </div>
                    <div className="stat-item">
                        <h2>1000+</h2>
                        <p>Orders Fulfilled</p>
                    </div>
                    <div className="stat-item">
                        <h2>500+</h2>
                        <p>Verified Sellers</p>
                    </div>
                </div>
            </div>
        </div>
    );
}