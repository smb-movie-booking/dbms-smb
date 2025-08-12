import React, { useEffect, useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";

export default function ViewCinemas() {
  const [cinemas, setCinemas] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/cinemas").then(res => setCinemas(res.data)).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this cinema?")) return;
    try {
      await axiosInstance.delete(`/admin/cinemas/${id}`);
      setCinemas(prev => prev.filter(c => c.CinemaID !== id));
    } catch (err) {
      alert("Could not delete: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Cinemas</h2>
        <table style={{ width: "100%" }}>
          <thead><tr><th>ID</th><th>Name</th><th>CityID</th><th>Halls</th><th>Action</th></tr></thead>
          <tbody>
            {cinemas.map(c => (
              <tr key={c.CinemaID}>
                <td>{c.CinemaID}</td>
                <td>{c.Cinema_Name}</td>
                <td>{c.CityID}</td>
                <td>{c.TotalCinemaHalls}</td>
                <td><button onClick={() => handleDelete(c.CinemaID)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
