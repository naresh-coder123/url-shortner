import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/Axios";

const Landing = ({ loginStat }) => {
  const [isLoggedIn] = loginStat;
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShorten = async (e) => {
    // If not logged in, redirect to signup/login immediately
    if (!isLoggedIn) {
      alert("Please login first to shorten links!");
      navigate("/login");
      return;
    }

    if (!longUrl) return alert("Please paste a URL");

    setLoading(true);
    try {
      const response = await api.post("/urls/shorten", { longUrl });
      
      console.log("Short URL generated:", response.data);
      
  
      navigate("/dashboard", { state: { newUrl: response.data.data } });
      
    } catch (err) {
      alert(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-sans min-h-screen p-6 w-full flex justify-center items-center bg-yellow-200">
      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-950 tracking-tight leading-tight">
          Short Links, <span className="text-yellow-600">Big Impact.</span>
        </h1>

        <p className="text-xl md:text-2xl mt-6 text-yellow-900/80 leading-relaxed max-w-2xl">
          Make your links count. Shorten, share, and track performance.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-lg">
          <input
            type="url"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Paste your long link here..."
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-yellow-300 focus:outline-none focus:border-yellow-600 bg-white shadow-sm"
          />
          
          <button 
            onClick={handleShorten}
            disabled={loading}
            className="bg-yellow-600 cursor-pointer text-xl text-white font-bold px-8 py-4 rounded-2xl hover:bg-yellow-400 hover:text-yellow-950 transition-colors shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "Shorten"}
          </button>
        </div>
        
        <p className="mt-6 text-sm text-yellow-800 font-medium">
          Join 10,000+ users shortening links daily.
        </p>
      </div>
    </main>
  );
};

export default Landing;