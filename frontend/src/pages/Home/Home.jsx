import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios'; // adjust path if needed
import toast from 'react-hot-toast'; 
import Navbar from '../../components/Navbar/Navbar';
import './home.css'

// --- COMPREHENSIVE FILTER OPTIONS ---
// (We keep the full lists, but only use the ones we need below)

const facilityOptions = [
    // ... (defined but not used by this component)
];

const genreOptions = [
    { value: "Action", label: "Action" },
    { value: "Adventure", label: "Adventure" },
    { value: "Animation", label: "Animation" },
    { value: "Biography", label: "Biography" },
    { value: "Comedy", label: "Comedy" },
    { value: "Crime", label: "Crime" },
    { value: "Drama", label: "Drama" },
    { value: "Family", label: "Family" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "History", label: "History" },
    { value: "Horror", label: "Horror" },
    { value: "Musical", label: "Musical" },
    { value: "Mystery", label: "Mystery" },
    { value: "Period", label: "Period" },
    { value: "Romance", label: "Romance" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Sports", label: "Sports" },
    { value: "Thriller", label: "Thriller" },
    { value: "War", label: "War" },
];

const languageOptions = [
    // --- Major Indian Languages ---
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "Malayalam", label: "Malayalam" },
    { value: "Tamil", label: "Tamil" },
    { value: "Telugu", label: "Telugu" },
    { value: "Kannada", label: "Kannada" },
    { value: "Marathi", label: "Marathi" },
    { value: "Bengali", label: "Bengali" },
    { value: "Punjabi", label: "Punjabi" },
    { value: "Gujarati", label: "Gujarati" },
    { value: "Odia", label: "Odia" },
    { value: "Assamese", label: "Assamese" },
    { value: "Bhojpuri", label: "Bhojpuri" },
    { value: "Tulu", label: "Tulu" },
    { value: "Konkani", label: "Konkani" },
    { value: "Haryanvi", label: "Haryanvi" },
    { value: "Rajasthani", label: "Rajasthani" },
    // --- Common Foreign Languages ---
    { value: "Korean", label: "Korean" },
    { value: "Japanese", label: "Japanese" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "Mandarin", label: "Mandarin" },
];

const ageFormatOptions = [
    // ... (defined but not used by this component)
];

const formatOptions = [
    { value: "2D", label: "2D" },
    { value: "3D", label: "3D" },
    { value: "IMAX", label: "IMAX" },
    { value: "4DX", label: "4DX" },
    { value: "IMAX 3D", label: "IMAX 3D" },
    { value: "4DX 3D", label: "4DX 3D" },
];

// --- HOME COMPONENT ---

const Home = ({ selectedCity }  ) => {
  // State for storing movies, filters, and current city
  const [movies, setMovies] = useState([]);
  
  // --- REVERTED filters state ---
  const [filters, setFilters] = useState({
    languages: [],
    genres: [],
    formats: [],
    // ageFormats: [], // REMOVED
    // facilities: []  // REMOVED
  });
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- REVERTED Function to fetch movies ---
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/api/movies/explore', {
        params: {
          city: selectedCity.id,
          language: filters.languages.join(','),
          genre: filters.genres.join(','),
          format: filters.formats.join(','),
          // ageFormat: filters.ageFormats.join(','), // REMOVED
          // facility: filters.facilities.join(',')  // REMOVED
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
    if (selectedCity && selectedCity.id) { // Added check for selectedCity
        fetchMovies();
    }
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
    navigate(`/movies/${movieId}`);
  };
  
  const handleSearchMovieClick = ()=>{
    navigate('/searchmovie');
  }

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
  align-items: start; 
  flex: 1;          
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
  min-height: 2.4rem; 
}

.movie-info p {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

@media (max-width: 600px) {
  .movie-card img { height: 220px; }
  .filters-section { display:none; } 
}
`}</style>

    <div className='cont'>
        
        {/* Main content area with filters and movie list */}
        <div className="home-container">
            {/* --- REVERTED Filters Section (Left) --- */}
            <div className="filters-section">
                <h2>Filters</h2>

                <div className="filter-group">
                    <h3>Languages</h3>
                    <div className="filter-options">
                        {languageOptions.map(opt => (
                            <button 
                                key={opt.value} 
                                className={`filter-btn ${filters.languages.includes(opt.value) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('languages', opt.value)}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Genres</h3>
                     <div className="filter-options">
                        {genreOptions.map(opt => (
                            <button 
                                key={opt.value} 
                                className={`filter-btn ${filters.genres.includes(opt.value) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('genres', opt.value)}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <h3>Format</h3>
                     <div className="filter-options">
                        {formatOptions.map(opt => (
                            <button 
                                key={opt.value} 
                                className={`filter-btn ${filters.formats.includes(opt.value) ? 'active' : ''}`}
                                onClick={() => handleFilterChange('formats', opt.value)}>
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* --- Age Rating Filter REMOVED --- */}
                
                {/* --- Facilities Filter REMOVED --- */}

                <button className="browse-cinemas-btn" onClick={handleSearchMovieClick}>Browse by Cinemas</button>
            </div>
            
            {/* --- Movie List Section (Right) --- */}
            <div className="movies-section">
                <h2>Movies in {selectedCity?.name || 'your city'}</h2> {/* Added fallback for selectedCity.name */}
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