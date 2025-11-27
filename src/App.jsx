// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Header from "./components/Header";
import { getAccessToken } from "./api/tokenService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  // listen for storage changes (other tabs) and update auth state
  useEffect(() => {
    const handler = () => setIsLoggedIn(!!getAccessToken());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // also keep console trace for state changes
  useEffect(() => {
    console.log("[App] isLoggedIn =", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <BrowserRouter>
      {/* Header should appear ONLY after login */}
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}


      <Routes>
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile"
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />}
        />

        {/* Default Redirect */}
        <Route
          path="*"
          element={<Navigate to={isLoggedIn ? "/home" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
