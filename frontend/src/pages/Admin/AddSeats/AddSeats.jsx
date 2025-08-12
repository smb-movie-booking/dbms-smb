import React, { useEffect, useState } from "react";
import axios from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddSeats() {
  const [halls, setHalls] = useState([]);
  const [hallId, setHallId] = useState("");
  const [seatCount, setSeatCount] = useState(10);
  const [seatType, setSeatType] = useState(1); // arbitrary type mapping
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/admin/cinema-halls").then(res => setHalls(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // make multiple inserts for seats; backend can accept batch
      await axios.post("/admin/cinema-seats", {
        CinemaHallID: hallId,
        Seats: seatCount,
        Seat_Type: seatType
      });
      alert("Seats added (backend should create Cinema_Seat rows)");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Could not add seats: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Add Seats</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: "grid", gap: 8 }}>
          <select value={hallId} onChange={e => setHallId(e.target.value)} required>
            <option value="">Select Hall</option>
            {halls.map(h => <option key={h.CinemaHallID} value={h.CinemaHallID}>{h.Hall_Name} - {h.CinemaID}</option>)}
          </select>
          <input type="number" min="1" value={seatCount} onChange={e => setSeatCount(e.target.value)} placeholder="Number of seats to create" />
          <input type="number" min="1" value={seatType} onChange={e => setSeatType(e.target.value)} placeholder="Seat type (int or enum id)" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Create Seats</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
