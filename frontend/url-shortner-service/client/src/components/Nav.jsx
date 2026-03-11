import React from "react";
import Logo from "../assets/logoNew.png";
import { Link, useNavigate } from "react-router-dom";

const Nav = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const navItemsClass = `font-bold text-2xl text-white p-2 border-4 border-yellow-100 rounded-2xl hover:border-yellow-200 transition-all duration-100 hover:bg-yellow-200 hover:text-black cursor-pointer`;

  const handleLogout = () => {
    // 1. Clear authentication (example: localStorage.removeItem("token"))
    setIsLoggedIn(false);
    navigate("/"); // Redirect to home after logout
  };

  return (
    // Added z-50 to keep nav on top and removed redundant outer margins
    <nav className="flex fixed top-0 left-0 z-50 items-center justify-between shadow-md shadow-yellow-950 h-20 w-full bg-yellow-700 font-sans px-10">
      
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <Link to="/">
          <div className="h-16 w-52 overflow-hidden flex items-center">
            <img src={Logo} alt="logo" className="object-contain" />
          </div>
        </Link>
      </div>

      {/* Right Section: Buttons */}
      <div className="flex gap-8">
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <div className={navItemsClass}>Login</div>
            </Link>
            <Link to="/register">
              <div className={navItemsClass}>Sign Up</div>
            </Link>
          </>
        ) : (
          <div className={navItemsClass} onClick={handleLogout}>
            Logout
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;