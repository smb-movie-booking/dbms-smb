import React, { useState, useEffect } from "react";
import axios from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddCinemaHall() {
  const [cinemaId, setCinemaId] = useState("");
  const [cinemas, setCinemas] = useState([]);
  const [hallName, setHallName] = useState("");
  const [totalSeats, setTotalSeats] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/admin/cinemas").then(res => setCinemas(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/cinema-halls", {
        Hall_Name: hallName,
        TotalSeats: totalSeats,
        CinemaID: cinemaId
      });
      alert("Cinema Hall added");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to add hall: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar/>
      <div style={{ padding: 24 }}>
        <h2>Add Cinema Hall</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <select value={cinemaId} onChange={e => setCinemaId(e.target.value)} required>
            <option value="">Select Cinema</option>
            {cinemas.map(c => <option key={c.CinemaID} value={c.CinemaID}>{c.Cinema_Name}</option>)}
          </select>
          <input placeholder="Hall Name" value={hallName} onChange={e => setHallName(e.target.value)} required />
          <input type="number" min="1" placeholder="Total Seats" value={totalSeats} onChange={e => setTotalSeats(e.target.value)} required />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Add Hall</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
