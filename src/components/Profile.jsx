// src/components/Profile.jsx
import React, { useEffect, useState } from "react";
import "../css/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  if (!user) return <div style={{ padding: 20 }}>No profile loaded.</div>;

  return (
  <div className="profile-container">
    <h2 className="profile-title">Profile</h2>

    <div className="profile-row"><span className="profile-label">Name: </span> {user.username}</div>
    <div className="profile-row"><span className="profile-label">Email: </span> {user.email}</div>
    <div className="profile-row"><span className="profile-label">Role: </span> {user.roleName}</div>
    <div className="profile-row"><span className="profile-label">Department: </span> {user.departmentName}</div>
    <div className="profile-row"><span className="profile-label">District: </span> {user.districtName}</div>
    <div className="profile-row"><span className="profile-label">Block: </span> {user.blockName}</div>
  </div>
  );
};

export default Profile;
