import React, { useEffect, useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";

export default function ViewShows() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/shows").then(res => setShows(res.data)).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete show?")) return;
    try {
      await axiosInstance.delete(`/admin/shows/${id}`);
      setShows(prev => prev.filter(s => s.ShowID !== id));
    } catch (err) {
      alert("Could not delete show: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Shows</h2>
        <table style={{ width: "100%" }}>
          <thead><tr><th>ID</th><th>Movie</th><th>Hall</th><th>Start</th><th>End</th><th>Action</th></tr></thead>
          <tbody>
            {shows.map(s => (
              <tr key={s.ShowID}>
                <td>{s.ShowID}</td>
                <td>{s.Title || s.movie_title || s.MovieID}</td>
                <td>{s.HallName || s.CinemaHallID}</td>
                <td>{s.StartTime}</td>
                <td>{s.EndTime}</td>
                <td><button onClick={() => handleDelete(s.ShowID)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
