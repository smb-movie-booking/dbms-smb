import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import toast from "react-hot-toast";

export default function ViewCinemaHalls() {
  const [halls, setHalls] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState("");

useEffect(() => {
  axiosInstance
    .get("/admin/cinemas")
    .then(res => {
      setCinemas(res.data.cinemas);
      if (res.data.cinemas.length > 0) setSelectedCinema(res.data.cinemas[0].CinemaID);
    })
    .catch(err => console.error(err));
}, []);

  // Fetch all halls
  useEffect(() => {
    axiosInstance
      .get("/admin/cinema-halls")
      .then(res => setHalls(res.data.halls))
      .catch(err => console.error(err));
  }, []);

  // Filter halls by selected cinema
  const filteredHalls = selectedCinema
    ? halls.filter(h => h.CinemaID === parseInt(selectedCinema))
    : halls;

  return (
    <>
      <Navbar />
      <div style={{ padding: "24px 16px" }}> {/* Adjusted container padding */}
        <h2 style={{ marginBottom: 24 }}>Cinema Halls</h2> {/* More spacing below heading */}

        <div style={{ marginBottom: 24 }}> {/* More spacing between dropdown and table */}
          <label>
            Select Cinema:{" "}
            <select
              value={selectedCinema}
              onChange={e => setSelectedCinema(e.target.value)}
              style={{ padding: "6px 10px", borderRadius: 4 }}
            >
              {cinemas.map(c => (
                <option key={c.CinemaID} value={c.CinemaID}>
                  {c.Cinema_Name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Hall Name</th>
              <th style={{ padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Seat Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredHalls.length > 0 ? (
              filteredHalls.map(h => {
                const cinema = cinemas.find(c => c.CinemaID === h.CinemaID);
                return (
                  <tr key={h.HallID}>
                    <td style={{ padding: "8px 12px", borderBottom: "1px solid #ddd" }}>{h.CinemaHallID}</td>
                    <td style={{ padding: "8px 12px", borderBottom: "1px solid #ddd" }}>{h.Hall_Name}</td>
                    <td style={{ padding: "8px 12px", borderBottom: "1px solid #ddd" }}>{h.TotalSeats}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "12px 0" }}>
                  No halls found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
