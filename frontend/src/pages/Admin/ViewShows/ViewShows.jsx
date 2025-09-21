import React, { useEffect, useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";

export default function ViewShows() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/view-shows").then(res => setShows(res.data.shows)).catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete show?")) return;
    try {
      await axiosInstance.delete(`/admin/delete-shows/${id}`);
      setShows(prev => prev.filter(s => s.ShowID !== id));
    } catch (err) {
      alert("Could not delete show: " + (err.response?.data?.message || err.message));
    }
  };

  const formatDate=(date)=>{
    const newDate=new Date(date).toLocaleDateString('en',{day:"2-digit", month:"short",year:"numeric"})
    return newDate

  }

  const formatTime=(data)=>{
    const time=new Date(data).toLocaleTimeString('en',{hour:"2-digit",minute:"2-digit",second:"2-digit"})
    return time
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Shows</h2>
        <table style={{ width: "100%" }}>
          <thead><tr><th>ID</th><th>Movie</th><th>Hall</th><th>Date</th><th>Start</th><th>End</th><th>Action</th></tr></thead>
          <tbody>
            {shows.map(s => (
              <tr key={s.ShowID}>
                <td>{s.ShowID}</td>
                <td>{s.Title || s.movie_title || s.MovieID}</td>
                <td>{s.HallName || s.CinemaHallID}</td>
                <td>{formatDate(s.Show_Date)}</td>
                <td>{formatTime(s.StartTime)}</td>
                <td>{formatTime(s.EndTime)  }</td>
                <td><button onClick={() => handleDelete(s.ShowID)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
