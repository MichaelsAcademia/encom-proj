import "./MobileSideModal.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const MobileSideModal = ({ handleModal, user, logout }) => {
    const [isClosing, setIsClosing] = useState(false);

    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            handleModal();
        }, 400);
    };


    
    const navigate = useNavigate();

    const handleAccount = (e) => {
        e.stopPropagation();
        if (user) {
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
        <div className="mobile-side-modal-blur" onClick={closeModal}>
            <div onClick={(e) => e.stopPropagation()} className={`${isClosing ? "slide-right-fade" : "slide-left-fade"}`}>
                <div className="mobile-side-modal-content">
                    {user && (
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
                </div>
            </div>
        </div>
    );
}