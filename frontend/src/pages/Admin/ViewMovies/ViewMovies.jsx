import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import toast from "react-hot-toast";

export default function ViewMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/movie")
      .then((res) => setMovies(res.data.movies))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this movie?")) return;
    try {
      const { data } = await axiosInstance.delete(`/admin/movie/${id}`);
      if (data.success) {
        setMovies((prev) => prev.filter((m) => m.MovieID !== id));
        toast.success(data.message);
      }
    } catch (err) {
      alert("Could not delete: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Movies</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Language</th>
              <th>Release</th>
              <th>Country</th>
              <th>Genre</th>
              <th>Rating</th>
              <th>Age</th>
              <th>Trailer</th>
              <th>Poster</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m.MovieID}>
                <td>{m.MovieID}</td>
                <td>{m.Title}</td>
                <td>{m.Movie_Description}</td>
                <td>{m.Duration}</td>
                <td>{m.Movie_Language}</td>
                <td>{m.ReleaseDate ? new Date(m.ReleaseDate).toLocaleDateString() : "-"}</td>
                <td>{m.Country}</td>
                <td>{m.Genre}</td>
                <td>{m.Rating}</td>
                <td>{m.Age_Format}</td>
                <td>
                  {m.Trailer_URL ? (
                    <a href={m.Trailer_URL} target="_blank" rel="noreferrer">
                      Watch
                    </a>
                  ) : "-"}
                </td>
                <td>
                  {m.Poster_Image_URL && (
                    <img
                      src={m.Poster_Image_URL}
                      alt={m.Title}
                      style={{ width: 60, borderRadius: 4 }}
                    />
                  )}
                </td>
                <td>
                  <button onClick={() => handleDelete(m.MovieID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
