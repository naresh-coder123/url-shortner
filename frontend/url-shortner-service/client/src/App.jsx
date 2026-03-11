import React, { useState } from "react";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Landing from "./pages/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      {/* Pass the state to Nav so it can show "Logout" or "Profile" */}
      <Nav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <div>
        <Routes>
          <Route path="/" element={<Landing isLoggedIn={isLoggedIn} />} />
          
          {/* Pass setIsLoggedIn so these pages can log the user in after success */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
          
          <Route path="/dashboard" element={<Dashboard isLoggedIn={isLoggedIn} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;