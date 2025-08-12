import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddCinema() {
  const [name, setName] = useState("");
  const [totalHalls, setTotalHalls] = useState(1);
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [facilities, setFacilities] = useState("");
  const [cancellationAllowed, setCancellationAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/admin/cities").then(res => setCities(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/cinemas", {
        Cinema_Name: name,
        TotalCinemaHalls: totalHalls,
        CityID: cityId,
        Facilities: facilities,
        Cancellation_Allowed: cancellationAllowed
      });
      alert("Cinema added");
      navigate("/admin/view-cinemas");
    } catch (err) {
      console.error(err);
      alert("Failed to add cinema: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar/>
      <div style={{ padding: 24 }}>
        <h2>Add Cinema</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <input placeholder="Cinema Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="number" min="1" placeholder="Total Halls" value={totalHalls} onChange={e => setTotalHalls(e.target.value)} required />
          <select value={cityId} onChange={e => setCityId(e.target.value)} required>
            <option value="">Select City</option>
            {cities.map(c => <option key={c.CityID} value={c.CityID}>{c.City_Name}</option>)}
          </select>
          <input placeholder="Facilities (comma separated)" value={facilities} onChange={e => setFacilities(e.target.value)} />
          <label><input type="checkbox" checked={cancellationAllowed} onChange={e => setCancellationAllowed(e.target.checked)} /> Cancellation Allowed</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Add Cinema</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
