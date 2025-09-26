import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function AddSeats() {
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");
  const [halls, setHalls] = useState([]);
  const [selectedHall, setSelectedHall] = useState("");
  const [seatCount, setSeatCount] = useState(10);
  const [seatType, setSeatType] = useState(1);

  const navigate = useNavigate();

  // Fetch cinemas
  useEffect(() => {
    axiosInstance
      .get("/admin/cinemas")
      .then(res => {
        setCinemas(res.data.cinemas);
        if (res.data.cinemas.length > 0) setSelectedCinema(res.data.cinemas[0].CinemaID);
      })
      .catch(console.error);
  }, []);

  // Fetch halls
  useEffect(() => {
    axiosInstance
      .get("/admin/cinema-halls")
      .then(res => setHalls(res.data.halls))
      .catch(console.error);
  }, []);

  // Filter halls by selected cinema
  const filteredHalls = selectedCinema
    ? halls.filter(h => h.CinemaID === parseInt(selectedCinema))
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedHall) {
      alert("Please select a hall");
      return;
    }
    try {
      await axiosInstance.post("/admin/cinema-seats", {
        hallId: selectedHall,
        seatCount,
        seatType
      });
      alert("Seats added successfully!");
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Could not add seats: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Add Seats</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: "grid", gap: 12 }}>
        {/* Cinema dropdown */}
        <select value={selectedCinema} onChange={e => setSelectedCinema(e.target.value)} required>
          <option value="">Select Cinema</option>
          {cinemas.map(c => (
            <option key={c.CinemaID} value={c.CinemaID}>{c.Cinema_Name}</option>
          ))}
        </select>

        {/* Hall dropdown filtered by selected cinema */}
        <select value={selectedHall} onChange={e => setSelectedHall(e.target.value)} required>
          <option value="">Select Hall</option>
          {filteredHalls.map(h => (
            <option key={h.CinemaHallID} value={h.CinemaHallID}>{h.Hall_Name}</option>
          ))}
        </select>

        {/* Seat count & type */}
        <input type="number" min="1" value={seatCount} onChange={e => setSeatCount(e.target.value)} placeholder="Number of seats" required />
        <input type="number" min="1" value={seatType} onChange={e => setSeatType(e.target.value)} placeholder="Seat type (int/enum id)" required />

        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit">Create Seats</button>
          <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
