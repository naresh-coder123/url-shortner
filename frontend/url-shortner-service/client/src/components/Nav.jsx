import React, { useState } from "react";
import Logo from "../assets/logoNew.png";
import { Link } from "react-router-dom";

const Nav = ({ loginStat }) => {
  const navItemsClass = `font-bold text-2xl text-white p-2 border-4 border-yellow-100 rounded-2xl hover:border-4 hover:border-yellow-200 transition-all duration-100 hover:bg-yellow-200 hover:text-black cursor-pointer`;

  const [isLoggedIn, setIsLogin] = loginStat;

  const handleLogin = () => {
    console.log("Handle Login");
  };
  const handleSignUp = () => {
    console.log("Handle SignUp");
  };

  return (
    <nav className="flex fixed items-center justify-between shadow-md shadow-yellow-950 h-20 w-full bg-yellow-700 font-sans">
      <div className="left flex w-auto ml-48 gap-8">
        <Link to="/">
          <div className="h-20 w-60 cursor-pointer ">
            <img src={Logo} alt="logo" />
          </div>
        </Link>
      </div>
      <div className="right flex w-auto mr-18 gap-8">
        {!isLoggedIn ? (
          <div className="right flex w-auto mr-48 gap-8">
            <Link to="/login">
              <div className={navItemsClass} onClick={handleLogin}>
                Login
              </div>
            </Link>
            <Link to="/register">
              <div className={navItemsClass} onClick={handleSignUp}>
                Sign/Up
              </div>
            </Link>
          </div>
        ) : (
          <div className="right flex w-auto mr-48 gap-8">
            <div className={navItemsClass} onClick={handleLogin}>
              Logout
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
