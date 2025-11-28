import "./Home.css";
import { useEffect, useRef } from "react";

// Dummy data for popular items
const popularItems = [
    {
        id: 1,
        title: "Margherita Pizza",
        price: 12,
        image: "https://placehold.co/300"
    },
    {
        id: 2,
        title: "Beef Tacos",
        price: 9,
        image: "https://placehold.co/300"
    },
    {
        id: 3,
        title: "Caesar Salad",
        price: 8,
        image: "https://placehold.co/300"
    },
    {
        id: 4,
        title: "Chicken Ramen",
        price: 14,
        image: "https://placehold.co/300"
    },
    {
        id: 5,
        title: "Cheeseburger",
        price: 11,
        image: "https://placehold.co/300"
    },
    {
        id: 6,
        title: "Sushi Platter",
        price: 22,
        image: "https://placehold.co/300"
    },
    {
        id: 7,
        title: "Pad Thai",
        price: 13,
        image: "https://placehold.co/300"
    },
    {
        id: 8,
        title: "Fish & Chips",
        price: 15,
        image: "https://placehold.co/300"
    }
];

export const Home = () => {

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
                            <div key={item.id} className="popular-item">
                                <img src={item.image} />
                                <h3>{item.title}</h3>
                                <p>${item.price}</p>
                            </div>
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