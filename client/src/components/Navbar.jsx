import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

import {
    SignOutIcon,
    SignInIcon,
    UserIcon,
    ShoppingCartSimpleIcon,
    TagIcon,
    PencilSimpleIcon
} from "@phosphor-icons/react";

export const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();

    const isLoggedIn = user && user.username;

    const handleAccount = (e) => {
        e.stopPropagation();
        console.log("Account");
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

        navigate("/");
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
                    <h2>ENCOM</h2>
                </Link>

                <div className="nav-content-group">
                    <div className="search-item">
                        <span className="search-icon fa-solid fa-magnifying-glass"></span>
                        <input className="search-input" type="text" placeholder="Search" />
                    </div>
                    <div className="nav-links-group">
                        {
                            isLoggedIn ? (
                            <>
                                <button className="nav-link-bttn" onClick={handleAccount}>
                                    <UserIcon size={26} weight="bold"/>
                                    <p className="nav-text">Account</p>
                                </button>
                                <button className="nav-link-bttn" onClick={handleCart}>
                                    <ShoppingCartSimpleIcon size={26} weight="bold"/>
                                    <p className="nav-text">Cart</p>
                                </button>
                                <button className="nav-link-bttn" onClick={handleListings}>
                                    <PencilSimpleIcon size={25} weight="bold"/>
                                    <p className="nav-text">Listings</p>
                                </button>
                                <button className="nav-link-bttn" onClick={handleOrders}>
                                    <TagIcon size={24} weight="bold"/>
                                    <p className="nav-text">Orders</p>
                                </button>
                                <button className="nav-link-bttn" onClick={handleLogout}>
                                    <SignOutIcon className="logout-icon" size={24} weight="bold"/>
                                    <p className="nav-text">Log Out</p>
                                </button>
                            </>
                        ) : (
                            <button className="nav-link-bttn" onClick={handleAccount}>
                                <SignInIcon size={28} weight="bold"/>
                                <p className="nav-text">Log In</p>
                            </button>
                        )}
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