import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/Axios";

const Landing = ({ isLoggedIn }) => {
  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <main className="font-sans min-h-screen p-6 w-full flex justify-center items-center bg-yellow-200">
      <div className="flex flex-col items-center text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-yellow-950 tracking-tight leading-tight">
          Short Links, <span className="text-yellow-600">Big Impact.</span>
        </h1>

        <p className="text-xl md:text-2xl mt-6 text-yellow-900/80 leading-relaxed max-w-2xl">
          Make your links count. Shorten, share, and track performance.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-teal-900">
            <h3 className="font-bold text-yellow-950 bg-amber-100 rounded-2xl p-3">
              ⚡ Instant Shortening
            </h3>
            <p className="text-sm text-yellow-800/70 p-4">
              Create short links in milliseconds with zero hassle.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-teal-900">
            <h3 className="font-bold text-yellow-900 bg-amber-100 rounded-2xl p-3">
              📊 Analytics
            </h3>
            <p className="text-sm text-yellow-800/70 p-4">
              Track clicks, devices, and usage patterns easily.
            </p>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border-2 border-teal-900">
            <h3 className="font-bold text-yellow-900 bg-amber-100 rounded-2xl p-3">
              🔒 Secure
            </h3>
            <p className="text-sm text-yellow-800/70 p-4">
              Your data stays protected with modern security practices.
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm text-yellow-800 font-bold font-sans ">
          Long URLs are ugly. We fix that.
        </p>
      </div>
    </main>
  );
};

export default Landing;
