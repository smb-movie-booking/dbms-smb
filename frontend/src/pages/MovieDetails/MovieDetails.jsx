import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from '../../utils/axios';
import "./MovieDetails.css"; // Make sure this CSS file exists for styling

// The component now accepts `selectedCity` as a prop from App.jsx
const MovieDetails = ({ selectedCity }) => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function for the horizontal scrolling of review cards
  const scrollReviews = (direction) => {
    const container = document.querySelector('.review-cards-wrapper');
    if (container) {
      const scrollAmount = 300; // Pixels to scroll per click
      container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchMovieAndReviews = async () => {
      try {
        // Fetch both movie details and reviews concurrently for better performance
        const moviePromise = axiosInstance.get('/api/movies/explore', {
          params: { movie: movieId }
        });
        
        // This is an example endpoint for reviews, adjust if yours is different
        const reviewsPromise = axiosInstance.get(`/api/movies/${movieId}/reviews`);

        const [movieResponse, reviewsResponse] = await Promise.all([moviePromise, reviewsPromise]);

        setMovie(movieResponse.data);
        setReviews(reviewsResponse.data);
      } catch (err) {
        console.error("Error fetching movie details or reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndReviews();
  }, [movieId]); // Re-run this effect if the movieId in the URL changes

  if (loading) {
    return <p style={{ padding: '20px' }}>Loading movie details...</p>;
  }
  
  if (!movie) {
    return <p style={{ padding: '20px' }}>Sorry, this movie could not be found.</p>;
  }

  return (
    <div className="movie-detail">
      <div className="movie-header">
        <div className="movie-poster">
          <a href={movie.Trailer_URL} target="_blank" rel="noopener noreferrer" title="Watch Trailer">
            <img src={movie.Poster_Image_URL} alt={movie.Title} />
          </a>
          <p className="trailer-link">
            <a href={movie.Trailer_URL} target="_blank" rel="noopener noreferrer">
              Watch Trailer
            </a>
          </p>
        </div>

        <div className="movie-info">
          <h1>{movie.Title}</h1>
          <p className="rating">⭐ {movie.Rating || 'Not Rated'}</p>
          <p className="description">{movie.Movie_Description}</p>
          
          <div className="info-grid">
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Language:</strong> {movie.Movie_Language}</p>
            <p><strong>Duration:</strong> {movie.Duration}</p>
            <p><strong>Release:</strong> {new Date(movie.ReleaseDate).toLocaleDateString()}</p>
          </div>

          <Link 
            to={`/movie/${movieId}/theaters?city=${selectedCity?.id}`}
            className="book-tickets-link"
          >
            <button className="book-tickets-btn">
              Book Tickets
            </button>
          </Link>
        </div>
      </div>

      <div className="review-section">
        <h2>Reviews</h2>
        <div className="review-scroll-container">
          <button className="scroll-btn left" onClick={() => scrollReviews(-1)}>‹</button>
          <div className="review-cards-wrapper">
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div key={idx} className="review-card">
                  <p className="review-comment">"{review.Comment}"</p>
                  <p className="review-author"><strong>- {review.username}</strong> | ⭐ {review.Rating}</p>
                </div>
              ))
            ) : (
              <p>No reviews yet for this movie.</p>
            )}
          </div>
          <button className="scroll-btn right" onClick={() => scrollReviews(1)}>›</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

