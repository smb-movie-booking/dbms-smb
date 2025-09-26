import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/auth/useAdmin";

export default function AddCinema() {
  const [name, setName] = useState("");
  const [totalHalls, setTotalHalls] = useState(1);
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [facilities, setFacilities] = useState("");
  const [cancellationAllowed, setCancellationAllowed] = useState(false);
  const {addCinemas}=useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance.get("/admin/cities").then(res => setCities(res.data.cities)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addCinemas({name,totalHalls,cityId,facilities:facilities || null , cancellationAllowed}) //didnt include facilities and cancellationAllowed
      alert("Cinema added");
      navigate("/admin/view-cinemas");
    } catch (err) {
      console.error(err);
      alert("Failed to add cinema: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <div style={{ padding: 24 }}>
        <h2>Add Cinema</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 560 }}>
          <input placeholder="Cinema Name" value={name} onChange={e => setName(e.target.value)} required />
          <input type="number" min="1" placeholder="Total Halls" value={totalHalls} onChange={e => setTotalHalls(e.target.value)} required />
          <select value={cityId} onChange={e => setCityId(e.target.value)} required>
            <option value="">Select City</option>
            {cities.length>0 && cities?.map(c => <option key={c.CityID} value={c.CityID}>{c.City_Name}</option>)}
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
