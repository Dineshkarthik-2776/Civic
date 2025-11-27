// src/components/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOfficerProfile, getFieldWorkers } from "../api/headerApi";
import { clearAuthTokens, getAccessToken } from "../api/tokenService";
import "../css/header.css";
import User from "../assets/user.png";

const Header = ({ setIsLoggedIn }) => {
  const [officer, setOfficer] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [fieldWorkers, setFieldWorkers] = useState(() => JSON.parse(localStorage.getItem("fieldWorkers")) || []);
  const [dropdown, setDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // auto-close dropdown
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch data
  useEffect(() => {
    async function load() {
      try {
        const off = await getOfficerProfile();
        setOfficer(off);
        localStorage.setItem("user", JSON.stringify(off));

        const workers = await getFieldWorkers();
        setFieldWorkers(workers);
        localStorage.setItem("fieldWorkers", JSON.stringify(workers));
      } catch (err) {
        console.error("[Header] Error fetching data", err);
      }
    }

    if (getAccessToken()) load();
  }, []);

  const handleLogout = () => {
    console.log("[Header] Logging out...");

    clearAuthTokens();
    localStorage.removeItem("user");
    localStorage.removeItem("fieldWorkers");

    // FIX → tell App.jsx that user logged out
    setIsLoggedIn(false);

    navigate("/login");
  };

  return (
    <header className="hd-header">

      {/* LEFT LOGO */}
      <div className="hd-logo" onClick={() => navigate("/home")}>
        NiVARAN
      </div>

      {/* CENTER DETAILS */}
      <div className="hd-center">
        <div className="hd-center-dept">{officer?.departmentName}</div>
        <div className="hd-center-district">{officer?.districtName}</div>
      </div>

      {/* RIGHT SECTION */}
      <div className="hd-right">
        
        {/* NOTIFICATION */}
        <div className="hd-notification">
          <svg className="hd-bell" viewBox="0 0 24 24">
            <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 00-4-5.7V5a2 2 0 10-4 0v.3C7.7 6.2 6 8.4 6 11v3.2c0 .5-.2 1.1-.6 1.5L4 17h5m6 0v1a3 3 0 11-6 0v-1"
              stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <span className="hd-badge">3</span>
        </div>

        {/* USER MENU */}
        <div className="hd-user-area" ref={dropdownRef}>
          <button className="hd-user-btn" onClick={() => setDropdown(!dropdown)}>
            <img src={User} className="hd-avatar" />
            <span className="hd-username">{officer?.username || "User"}</span>

            {/* NEW ICON → CHEVRON */}
            <svg
              className={`hd-chevron ${dropdown ? "open" : ""}`}
              viewBox="0 0 24 24"
              width="18"
              height="18"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdown && (
            <div className="hd-dropdown">
              <div className="hd-dropdown-header">
                <div className="hd-drop-name">{officer?.username}</div>
                <div className="hd-drop-email">{officer?.email}</div>
              </div>

              <button className="hd-dropdown-item" onClick={() => navigate("/profile")}>
                Profile
              </button>

              <button className="hd-dropdown-item hd-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
