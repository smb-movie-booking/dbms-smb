import React, { useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("02:00:00"); // HH:MM:SS
  const [language, setLanguage] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [poster, setPoster] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/movies", {
        Title: title,
        Movie_Description: description,
        Duration: duration,
        Movie_Language: language,
        ReleaseDate: releaseDate || null,
        Genre: genre,
        Poster_Image_URL: poster
      });
      alert("Movie added");
      navigate("/admin/view-movies");
    } catch (err) {
      console.error(err);
      alert("Failed to add movie: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Add Movie</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 640, display: "grid", gap: 8 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} />
          <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (HH:MM:SS)" />
          <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language" />
          <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} placeholder="Release date" />
          <input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" />
          <input value={poster} onChange={e => setPoster(e.target.value)} placeholder="Poster URL" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Add Movie</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
