// src/pages/Admin/AdminDashboard/AdminDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar/Navbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cardStyle = {
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    background: "#fff",
    cursor: "pointer",
  };

  return (
    <>
      <Navbar />
      <div className="admin-container" style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 16 }}>Admin Dashboard</h1>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))" }}>
          <div style={cardStyle} onClick={() => navigate("/admin/add-city")}>Add City</div>
          <div style={cardStyle} onClick={() => navigate("/admin/add-cinema")}>Add Cinema</div>
          <div style={cardStyle} onClick={() => navigate("/admin/add-hall")}>Add Cinema Hall</div>
          <div style={cardStyle} onClick={() => navigate("/admin/add-seats")}>Add Seats</div>
          <div style={cardStyle} onClick={() => navigate("/admin/add-movie")}>Add Movie</div>
          <div style={cardStyle} onClick={() => navigate("/admin/add-show")}>Add Show</div>

          <div style={cardStyle} onClick={() => navigate("/admin/view-cities")}>View Cities</div>
          <div style={cardStyle} onClick={() => navigate("/admin/view-cinemas")}>View Cinemas</div>
           <div style={cardStyle} onClick={() => navigate("/admin/view-halls")}>View Cinema Halls</div>
          <div style={cardStyle} onClick={() => navigate("/admin/view-movies")}>View Movies</div>
          <div style={cardStyle} onClick={() => navigate("/admin/view-shows")}>View Shows</div>
        </div>

        <div style={{ marginTop: 20 }}>
          <button className="btn" onClick={() => navigate("/")}>Go to Home</button>
        </div>
      </div>
    </>
  );
}
