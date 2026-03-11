import React, { useState } from "react";
import api from "../assets/Axios";
import Loader from "../assets/Loader.svg"
const Login = ({ setIsLoggedIn }) => {
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", formData);
      
  
      localStorage.setItem("accessToken", response.data.data.accessToken);
      
      
      setIsLoggedIn(true);
      
     
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };
  


  return (
    <main className="font-sans min-h-screen p-6 w-full flex justify-center items-center bg-yellow-200">
      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-yellow-950 tracking-tight leading-tight">
          Login In to Your Account
        </h1>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="alex@example.com"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-yellow-950 font-bold ml-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="mt-4 hover:text-yellow-950 bg-yellow-600 text-white font-bold py-4 rounded-2xl hover:bg-yellow-400 active:scale-95 transition-all shadow-lg text-lg cursor-pointer"
          >
           
                      {loading ? (
                         <img src={Loader} alt="loading..." className="w-8 h-8 animate-spin" />
                       ) : (
                         "Sign in"
                       )}
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
