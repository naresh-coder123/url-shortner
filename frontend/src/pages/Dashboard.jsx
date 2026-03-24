import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../assets/Axios";
import UrlDisplay from "../components/UrlDisplay";
const Dashboard = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const [longUrl, setLongUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [userUrls, setUserUrls] = useState([]);

  useEffect(() => {
    const fetchUrls = async () => {
      const res = await api.get("/shorten/urls");
      setUserUrls(
        res.data.data.map((url) => ({
          _id: url._id,
          urlShort: `https://your-backend.onrender.com/${url.shortUrl}`,
          urlLong: url.longUrl,
          clicks: url.clicks,
        })),
      );
    };

    // Fetch All the Previous URL's may have been created by User
    fetchUrls();
  }, []);
  // Big Array store all the URLs created by user In this Session

  const handleShorten = async (e) => {
    if (!isLoggedIn) {
      alert("Please login first to shorten links!");
      navigate("/login");
      return;
    }

    if (!longUrl) return alert("Please paste a URL");

    setLoading(true);
    try {
      const response = await api.post("/shorten", { longUrl });
      const newUrlData = response.data.data;

      // Create the new object to match your table's structure
      const newUrlEntry = {
        _id: newUrlData._id || newUrlData.id, // Handle potential key difference
        urlShort: `https://your-backend.onrender.com/${newUrlData.shortUrl}`, // Add prefix here too!
        urlLong: newUrlData.longUrl,
        clicks: newUrlData.clicks || 0,
      };

      setUserUrls((prev) => [newUrlEntry, ...prev]);

      // Clear the input field for a better user experience
      setLongUrl("");

      console.log("UI Updated Instantly!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="font-sans min-h-screen p-8 w-full bg-yellow-200 pt-28">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 items-center ">
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

        {userUrls.length > 0 && (
          <div>
            <h1 className="text-5xl mt-10 mb-10 font-black text-center text-yellow-950">
              Your Analytics Dashboard
            </h1>

            <div className="bg-white rounded-3xl shadow-sm border border-yellow-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-yellow-700 text-white">
                  <tr>
                    <th className="p-4">Original URL</th>
                    <th className="p-4">Short Link</th>
                    <th className="p-4">Clicks</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userUrls.map(({ urlShort, urlLong, clicks, _id }) => (
                    <UrlDisplay
                      urlShort={urlShort}
                      urlLong={urlLong}
                      key={_id}
                      id={_id}
                      clicks={clicks}
                      onRowClick={() => navigate(`/analytics/${_id}`)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
