import React, { useState } from "react";
import api from "../assets/Axios";
import Loader from "../assets/Loader.svg";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setUser }) => {
  const navigate = useNavigate();

  // 1. Initialize state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/user/login", formData);

      // Store token
      localStorage.setItem("accessToken", response.data.data.accessToken);
      const res = await api.get("/shorten/me");

      // Update global auth state
      setIsLoggedIn(true);
      setUser(res.data.data);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans min-h-screen p-6 w-full flex justify-center items-center bg-yellow-200">
      <div className="flex flex-col items-center text-center max-w-4xl w-full">
        <h1 className="text-5xl font-extrabold text-yellow-950 tracking-tight leading-tight">
          Log In to Your Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col gap-5 w-full max-w-md"
        >
          {/* Error Message Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-2 text-left">
            <label className="text-yellow-950 font-bold ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="alex@example.com"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2 text-left">
            <label className="text-yellow-950 font-bold ml-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="••••••••"
              required
              className="px-5 py-3 rounded-2xl border-2 border-yellow-100 focus:outline-none focus:border-yellow-600 bg-yellow-50/50 transition-colors"
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-4 flex justify-center items-center hover:text-yellow-950 bg-yellow-600 text-white font-bold py-4 rounded-2xl hover:bg-yellow-400 active:scale-95 transition-all shadow-lg text-lg cursor-pointer disabled:bg-yellow-800"
          >
            {loading ? (
              <img
                src={Loader}
                alt="loading..."
                className="w-8 h-8 animate-spin"
              />
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
