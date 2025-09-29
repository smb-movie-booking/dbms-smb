import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios'; // adjust path if needed
import toast from 'react-hot-toast'; 
import Navbar from '../../components/Navbar/Navbar';
import './home.css'


const Home = ({ selectedCity }  ) => {
  // State for storing movies, filters, and current city
  const [movies, setMovies] = useState([]);
  const [filters, setFilters] = useState({
    languages: [],
    genres: [],
    formats: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Hardcoded filter options for the UI
  const availableLanguages = ['Malayalam', 'English', 'Hindi', 'Tamil', 'Korean', 'Odia', 'Telugu'];
  const availableGenres = ['Action', 'Comedy', 'Drama', 'Thriller', 'Sci-Fi'];
  const availableFormats = ['2D', '3D', 'IMAX', '4DX'];

  // Function to fetch movies from the backend
  const fetchMovies = async () => {
    setLoading(true);
    try {
      // Construct the query parameters from the filters state
      const queryParams = new URLSearchParams({ city: selectedCity.id });
      if (filters.languages.length > 0) queryParams.append('language', filters.languages.join(','));
      if (filters.genres.length > 0) queryParams.append('genre', filters.genres.join(','));
      if (filters.formats.length > 0) queryParams.append('format', filters.formats.join(','));
      

    const { data } = await axiosInstance.get('/movies/explore', {
      params: {
        city: selectedCity.id,
        language: filters.languages.join(','),
        genre: filters.genres.join(','),
        format: filters.formats.join(',')
      }
    });

    setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      // Handle error state in a real app, e.g., show a message to the user
    } finally {
      setLoading(false);
    }
  };

  // useEffect to fetch movies when the component mounts or when filters/city change
  useEffect(() => {
    fetchMovies();
  }, [selectedCity, filters]);

  // Handler for selecting/deselecting a filter
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters[filterType];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value) // Deselect
        : [...currentValues, value]; // Select
      return { ...prevFilters, [filterType]: newValues };
    });
  };
  
  // Handler for clicking on a movie poster
  const handleMovieClick = (movieId) => {
    // Navigate to the movie detail page
    // This assumes you have a route like "/explore/movie/:id"
    navigate(`/movies/${movieId}`);
  };

  return (
    <>
<style>{`
/* ---------- Page + layout ---------- */
.cont {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 0 2rem;
  box-sizing: border-box;
}

/* Main content layout */
.home-container {
  display: flex;
  gap: 2rem;
  padding-top: 2rem;
}

/* ---------- Filters (kept as before) ---------- */
.filters-section { width: 280px; flex-shrink: 0; background: #fff; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); height: fit-content; }
.filters-section h2{ font-size:1.25rem; margin-bottom:1.5rem; color:#333; }
.filter-group{ margin-bottom:1.5rem; }
.filter-group h3{ font-size:0.9rem; color:#555; margin-bottom:0.75rem; font-weight:500; border-bottom:1px solid #eee; padding-bottom:0.5rem; }
.filter-options { display:flex; flex-wrap:wrap; gap:.5rem; }
.filter-btn { background:none; border:1px solid #f84464; color:#f84464; padding:.3rem .8rem; border-radius:20px; cursor:pointer; font-size:.8rem; transition:all .15s ease; }
.filter-btn.active, .filter-btn:hover { background:#f84464; color:#fff; }
.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  align-items: start; /* This is still good to have */
  flex: 1;          /* ✅ Add this line to make the grid expand */
}

.movies-section {
  flex: 1;
}

.movie-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  position: relative;
  /* REMOVE min-height or flex-grow */
}


.movie-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.12);
  z-index: 10;
}

.movie-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}

/* Info section */
.movie-info {
  padding: 1rem;
  text-align: left; 
}
.movie-info h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
  min-height: 2.4rem; /* ✅ Add this line */
}

.movie-info p {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}


/* ---------- Responsive tweaks ---------- */
@media (max-width: 600px) {
  .movie-card img { height: 220px; }
  .filters-section { display:none; } /* small screens hide filters (optional) */
}

/* ---------- Debugging helpers (temporary; remove if not needed) ---------- */
/* .movie-card { outline: 1px solid rgba(0,0,0,0.03); } */
`}</style>

    <div className='cont'>
        
        {/* Main content area with filters and movie list */}
        <div className="home-container">
            {/* --- Filters Section (Left) --- */}
            <div className="filters-section">
                <h2>Filters</h2>

                <div className="filter-group">
                    <h3>Languages</h3>
                    <div className="filter-options">
                        {availableLanguages.map(lang => (
                            <button 
                                key={lang} 
                                className={`filter-btn ${filters.languages.includes(lang) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('languages', lang)}>
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Genres</h3>
                     <div className="filter-options">
                        {availableGenres.map(genre => (
                            <button 
                                key={genre} 
                                className={`filter-btn ${filters.genres.includes(genre) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('genres', genre)}>
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Format</h3>
                     <div className="filter-options">
                        {availableFormats.map(format => (
                            <button 
                                key={format} 
                                className={`filter-btn ${filters.formats.includes(format) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('formats', format)}>
                                {format}
                            </button>
                        ))}
                    </div>
                </div>

                <button className="browse-cinemas-btn">Browse by Cinemas</button>
            </div>
            
            {/* --- Movie List Section (Right) --- */}
            <div className="movies-section">
                <h2>Movies in {selectedCity.name}</h2>
                {loading ? (
                    <p>Loading movies...</p>
                ) : (
                    <div className="movie-grid">
                        {movies.map((movie) => (
                            <div key={movie.MovieID} className="movie-card" onClick={() => handleMovieClick(movie.MovieID)}>
                                <img src={movie.Poster_Image_URL} alt={movie.Title} onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/200x300/f84464/FFFFFF?text=Image+Not+Found'; }} />
                                <div className="movie-info">
                                    <h3>{movie.Title}</h3>
                                    <p>{movie.Genre}</p>
                                 </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    </div>
    </>
  )
}


export default Home;

