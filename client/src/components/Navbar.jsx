import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = ({ handleMobileSideModal, user, logout }) => {
    const navigate = useNavigate();

    const isLoggedIn = user && user.username;

    console.log("Navbar - User:", user);

    const handleAccount = (e) => {
        e.stopPropagation();
        if (isLoggedIn) {
            console.log("Account - User is logged in");

            // Uncomment when account page is ready
            // navigate("/account");
        } else {
            navigate("/login");
        }
    }

    const handleCart = (e) => {
        e.stopPropagation();
        console.log("Cart");
        navigate("/cart");
    }

    const handleLogout = (e) => {
        e.stopPropagation();
        console.log("Logout");
        logout();
    }

    const handleListings = (e) => {
        e.stopPropagation();
        console.log("Listing");
    }

    const handleOrders = (e) => {
        e.stopPropagation();
        console.log("Orders");
        navigate("/orders");
    }

    return (
        <div className="nav">
            <div className="nav-content">
                <Link to="/" className="logo">
                    <h2>Encom ICON</h2>
                </Link>

                <div className="nav-content-group">
                    <div className="search-item">
                        <span className="search-icon fa-solid fa-magnifying-glass"></span>
                        <input className="search-input" type="text" placeholder="Search" />
                    </div>

                    <button className="burger-bttn" onClick={handleMobileSideModal}>
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </button>

                    <div className="nav-links-group">
                        {isLoggedIn && (
                            <button className="nav-link-bttn" onClick={handleLogout}>
                                <span className="fa-regular fa-arrow-left-from-bracket"></span>
                            </button>
                        )}

                        <button className="nav-link-bttn" onClick={handleAccount}>
                            <span className="fa-regular fa-user"></span>
                        </button>

                        <button className="nav-link-bttn" onClick={handleCart}>
                            <span className="fa-regular fa-cart-shopping"></span>
                        </button>

                        <button className="nav-link-bttn" onClick={handleListings}>
                            <span className="fa-regular fa-pen"></span>
                        </button>

                        <button className="nav-link-bttn" onClick={handleOrders}>
                            <span className="fa-regular fa-tag"></span>
                        </button>

                        {
                        /* Use this if you want to use NavLink instead of buttons

                        <NavLink to="/" className={"nav-link-bttn"}>
                            <span className="fa-regular fa-user"></span>
                        </NavLink>*/
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}