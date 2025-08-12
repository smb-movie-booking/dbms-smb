import React, { useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddCity() {
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [zip, setZip] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/cities", {
        City_Name: cityName,
        City_State: stateName,
        ZipCode: zip,
      });
      alert("City added");
      navigate("/admin/view-cities");
    } catch (err) {
      console.error(err);
      alert("Failed to add city: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container" style={{ padding: 24 }}>
        <h2>Add City</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <input value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="City Name" required />
          <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" required />
          <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip code" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Add City</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
