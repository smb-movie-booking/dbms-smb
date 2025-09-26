import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../index.css";
import Navbar from "../../components/Navbar/Navbar";
import { axiosInstance } from '../../utils/axios';
import "./MovieDetails.css";


const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);

   const scrollReviews = (direction) => {
    const container = document.querySelector('.review-cards-wrapper');
    const scrollAmount = 300; // pixels to scroll per click
    container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
  };


  useEffect(() => {
    const fetchMovie = async () => {
    try {
      const { data } = await axiosInstance.get('/movies/explore', {
        params: { movie: movieId }   // ✅ pass movieId as query param
      });
      setMovie(data);
    } catch (err) {
      console.error("Error fetching movie:", err);
    }
  };

    const fetchReviews = async () => {
      try {
        const { data } = await axiosInstance.get(`/movies/${movieId}/reviews`);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

   



    fetchMovie();
    fetchReviews();
  }, [movieId]);

  if (!movie) return <p>Loading...</p>;

  return (
    <>
        <Navbar />
        <div className="movie-detail">
          <div className="movie-header" style={{ display: "flex", gap: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <a href={movie.Trailer_URL} target="_blank" rel="noopener noreferrer">
                <img
                  src={movie.Poster_Image_URL}
                  alt={movie.Title}
                  style={{ width: "200px", borderRadius: "10px", cursor: "pointer" }}
                />
              </a>
              <p style={{ marginTop: "5px", fontWeight: "600", color: "#007bff", cursor: "pointer" }}>
                Trailer
              </p>
            </div>

            <div className="movie-info">
              <h1>{movie.Title}</h1>
              <p>{movie.Movie_Description}</p>
              <p>
                <strong>Genre:</strong> {movie.Genre} |{" "}
                <strong>Language:</strong> {movie.Movie_Language}
              </p>
              <p>
                <strong>Duration:</strong> {movie.Duration} |{" "}
                <strong>Release Date:</strong>{" "}
                {new Date(movie.ReleaseDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {movie.Rating}
              </p>
              <button
                style={{
                  background: "var(--secondary-color)",
                  border: "none",
                  borderRadius: "5px",
                  padding: "10px 20px",
                  color: "#fff",
                  fontWeight: "600",
                  marginTop: "10px",
                }}
              >
                Book Tickets
              </button>
            </div>
          </div>

          <div className="review-section" style={{ marginTop: "40px" }}>
          <h2>Reviews</h2>
          
          <div className="review-scroll-container">
            <button className="scroll-btn left" onClick={() => scrollReviews(-1)}>‹</button>
            
            <div className="review-cards-wrapper">
              {reviews.length > 0 ? (
                reviews.map((review, idx) => (
                  <div key={idx} className="review-card">
                    <p><strong>{review.username}</strong>: {review.Comment}</p>
                    <p>⭐ {review.Rating}</p>
                  </div>
                ))
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
            
            <button className="scroll-btn right" onClick={() => scrollReviews(1)}>›</button>
          </div>
        </div>


          </div>
    </>
    );
};

export default MovieDetails;
