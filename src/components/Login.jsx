// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
import { loginApi } from "../api/authApi";

import mapImg from "../assets/jharkhand-map.png";
import emblemImg from "../assets/emblem.png";
import stateLogo from "../assets/jharkhand.png";

export default function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("rcd.dhn.officer@mail.com");
  const [password, setPassword] = useState("Pass@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("[Login] submit", { loginId });

    try {
      const data = await loginApi({ loginId, password });
      console.log("[Login] loginApi returned:", data);

      // inform parent App that user is logged in
      if (typeof setIsLoggedIn === "function") {
        setIsLoggedIn(true);
      }

      // navigate to home (no extra navigates)
      navigate("/home");
    } catch (err) {
      // err is Error object from authApi
      const msg = err?.message || "Login failed. Try again.";
      console.warn("[Login] login failed:", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lgn-root">
      <aside className="lgn-left-visual" aria-hidden="true">
        <div className="lgn-logo-strip">
          <div className="lgn-logo-btn">
            <img src={emblemImg} alt="emblem" className="lgn-mini-logo" />
          </div>
          <div className="lgn-logo-btn">
            <img src={stateLogo} alt="state-logo" className="lgn-mini-logo" />
          </div>
        </div>

        <div className="lgn-map-frame">
          <img src={mapImg} alt="state map" className="lgn-map-img" />
        </div>

        <div className="lgn-left-foot">
          <p className="lgn-left-quote">
            “Empowering departments to build cleaner, safer cities.”
          </p>
        </div>
      </aside>

      <main className="lgn-right-panel" role="main">
        <div className="lgn-login-card" aria-labelledby="login-title">
          <div className="lgn-card-top">
            <h1 id="login-title">Department Portal</h1>
            <p className="lgn-subhead">Ranchi Municipal Corporation</p>
          </div>

          <form className="lgn-login-form" onSubmit={handleSubmit} noValidate>
            <label className="lgn-field">
              <div className="lgn-field-label">Login ID (email)</div>
              <input
                type="email"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="rcd.dhn.officer@mail.com"
                required
                aria-label="login id"
                className="lgn-input"
              />
            </label>

            <label className="lgn-field">
              <div className="lgn-field-label">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                aria-label="password"
                className="lgn-input"
              />
            </label>

            <div className="lgn-quote-small">
              “Civic duty is the heartbeat of healthy cities.”
            </div>

            {error && (
              <div className="lgn-error" role="alert">
                ⚠ {error}
              </div>
            )}

            <button
              className="lgn-btn-primary"
              type="submit"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          <footer className="lgn-card-footer">
            <small>Need help? Contact IT Support • Terms • Privacy</small>
          </footer>
        </div>
      </main>
    </div>
  );
}
