import React, { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import api from "./assets/Axios";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/shorten/me");

        setUser(res.data.data);
        setIsLoggedIn(true);
      } catch (err) {
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      {/* Pass the state to Nav so it can show "Logout" or "Profile" */}
      <Nav
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <div>
        <Routes>
          <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />

          {/* Pass setIsLoggedIn so these pages can log the user in after success */}
          <Route
            path="/login"
            element={<Login setUser={setUser} setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route
            path="/register"
            element={<SignUp setIsLoggedIn={setIsLoggedIn} />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Dashboard isLoggedIn={isLoggedIn} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
