import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = ({ user, logout }) => {

    const handleProfile = (e) => {
        e.stopPropagation();
        console.log("Profile");
    }

    const handleCart = (e) => {
        e.stopPropagation();
        console.log("Cart");
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

                    <button className="burger-bttn">
                        <div className="line"></div>
                        <div className="line"></div>
                        <div className="line"></div>
                    </button>

                    <div className="nav-links-group">
                        {
                            user ? (
                                <button className="nav-link-bttn" onClick={handleLogout}>
                                    <span className="fa-regular fa-arrow-left-from-bracket"></span>
                                </button>
                            ) : (
                                <>
                                <NavLink to="/login" className={"nav-link-bttn"}>
                                    Login
                                    {/* <span className="fa-regular fa-arrow-right-from-bracket"></span> */}
                                </NavLink>
                                <NavLink to="/signup" className={"nav-link-bttn"}>
                                    Signup
                                    {/* <span className="fa-regular fa-arrow-right-from-bracket"></span> */}
                                </NavLink>
                                </>
                            )
                        }
                        
                        <button className="nav-link-bttn" onClick={handleProfile}>
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