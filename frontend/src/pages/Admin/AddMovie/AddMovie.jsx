import React, { useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import './addMovie.css';
import { useAdmin } from "../../../hooks/auth/useAdmin";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("02:00:00");
  const [language, setLanguage] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [country, setCountry] = useState("");
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("");
  const [ageFormat, setAgeFormat] = useState("");
  const [trailerUrl, setTrailerUrl] = useState("");
  const [image, setImage] = useState(null);
  const { addMovie } = useAdmin();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !duration ||
      !language ||
      !releaseDate ||
      !country.trim() ||
      !genre.trim() ||
      !rating ||
      !ageFormat ||
      !trailerUrl.trim() ||
      !image
    )
      return false;

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return console.log("Form not valid");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("language", language);
    formData.append("releaseDate", releaseDate);
    formData.append("country", country);
    formData.append("genre", genre);
    formData.append("rating", rating);
    formData.append("ageFormat", ageFormat);
    formData.append("trailerUrl", trailerUrl);
    formData.append("file", image); // must match multer.single("file")

    try {
      setLoading(true);
      await addMovie(formData);
      navigate("/admin/add-movie");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Add Movie</h2>
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 640, display: "grid", gap: 8 }}
        >
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={4} />
          <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (HH:MM:SS)" />
          <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
          <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} />
          <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" />
          <input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Genre" />
          <input type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} placeholder="Rating (e.g. 8.5)" />
          <input value={ageFormat} onChange={(e) => setAgeFormat(e.target.value)} placeholder="Age Format (e.g. UA16, A, U)" />
          <input value={trailerUrl} onChange={(e) => setTrailerUrl(e.target.value)} placeholder="Trailer URL" />

          <div className="upload-preview-container">
            {image && (
              <div className="preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="poster-img"
                  className="preview-img"
                />
              </div>
            )}
            <input onChange={handleImageUpload} type="file" accept="image/*" />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Movie"}
            </button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
