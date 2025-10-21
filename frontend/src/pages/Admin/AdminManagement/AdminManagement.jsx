import React, { useState, useEffect , useRef} from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';

// --- REUSABLE & DETAIL COMPONENTS ---
// (No changes to ManagementSection, MovieDetails, CityDetails, CinemaDetails, HallDetails)
// ... (Your components: ManagementSection, MovieDetails, CityDetails, CinemaDetails, HallDetails)
const ManagementSection = ({ title, children }) => (
  <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginBottom: '24px', background: '#fff' }}>
    <h3 style={{ marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>{title}</h3>
    {children}
  </div>
);

const MovieDetails = ({ movie }) => (
    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4 style={{marginTop: 0}}>{movie.Title}</h4>
        <div style={{display: 'flex', gap: '20px'}}>
            <img src={movie.Poster_Image_URL} alt={movie.Title} style={{ width: '150px', height: '225px', objectFit: 'cover', borderRadius: '8px' }} />
            <div>
                <p><strong>Description:</strong> {movie.Movie_Description}</p>
                <p><strong>Genre:</strong> {movie.Genre}</p>
                <p><strong>Language:</strong> {movie.Movie_Language}</p>
                <p><strong>Release Date:</strong> {new Date(movie.ReleaseDate).toLocaleDateString()}</p>
                <p><strong>Duration:</strong> {movie.Duration}</p>
                <p><strong>Rating:</strong> {movie.Rating} / 10</p>
            </div>
        </div>
    </div>
);

const CityDetails = ({ city }) => (
    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4>Details for {city.City_Name}</h4>
        <p><strong>State:</strong> {city.City_State}</p>
        <p><strong>Zip Code:</strong> {city.ZipCode}</p>
    </div>
);

const CinemaDetails = ({ cinema }) => (
    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
        <h4>Details for {cinema.Cinema_Name}</h4>
        <p><strong>Facilities:</strong> {cinema.Facilities || 'Not specified'}</p>
        <p><strong>Cancellation Allowed:</strong> {cinema.Cancellation_Allowed ? 'Yes' : 'No'}</p>
    </div>
);

const HallDetails = ({ hall, allSeats }) => {
    const summarizeRanges = (numbers) => {
        if (!numbers.length) return '';
        const sorted = [...numbers].sort((a, b) => a - b);
        const ranges = [];
        let start = sorted[0];
        let end = sorted[0];
        for (let i = 1; i < sorted.length; i++) {
            if (sorted[i] === end + 1) {
                end = sorted[i];
            } else {
                ranges.push(start === end ? `${start}` : `${start}-${end}`);
                start = sorted[i];
                end = sorted[i];
            }
        }
        ranges.push(start === end ? `${start}` : `${start}-${end}`);
        return ranges.join(', ');
    };
    const seatConfig = allSeats.filter(seat => seat.CinemaHallID === hall.CinemaHallID).reduce((acc, seat) => {
        if (!acc[seat.Seat_Type]) acc[seat.Seat_Type] = [];
        acc[seat.Seat_Type].push(seat.SeatNumber);
        return acc;
    }, {});
    return (
        <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '4px' }}>
            <h4>Seat Configuration for {hall.Hall_Name}</h4>
            <ul>
                {Object.entries(seatConfig).map(([type, numbers]) => (
                    <li key={type}><strong>{type}:</strong> {numbers.length} seats ({summarizeRanges(numbers)})</li>
                ))}
            </ul>
        </div>
    );
};


// --- FORM COMPONENTS ---
// (No changes to AddCityForm, AddCinemaForm, AddHallForm, AddMovieForm, AddShowForm)
// ... (Your components: AddCityForm, AddCinemaForm, AddHallForm, AddMovieForm, AddShowForm)
const AddCityForm = ({ onCityAdded, onCancel }) => {
  const [cityName, setCityName] = useState('');
  const [cityState, setCityState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/admin/cities', { cityName, cityState, zipCode });
      toast.success('City added successfully!');
      onCityAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add city.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
      <input value={cityName} onChange={e => setCityName(e.target.value)} placeholder="City Name" required />
      <input value={cityState} onChange={e => setCityState(e.target.value)} placeholder="State" required />
      <input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="Zip Code" required />
      <div><button type="submit">Save City</button><button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button></div>
    </form>
  );
};

const AddCinemaForm = ({ cityId, onCinemaAdded, onCancel }) => {
    const [cinemaName, setCinemaName] = useState('');
    const [facilities, setFacilities] = useState('');
    const [cancellationAllowed, setCancellationAllowed] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/admin/cinemas', { name: cinemaName, cityId, facilities, cancellationAllowed });
            toast.success('Cinema added successfully!');
            onCinemaAdded();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add cinema.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
            <input value={cinemaName} onChange={e => setCinemaName(e.target.value)} placeholder="Cinema Name" required />
            <input value={facilities} onChange={e => setFacilities(e.target.value)} placeholder="Facilities (e.g., Parking,Dolby)" />
            <label><input type="checkbox" checked={cancellationAllowed} onChange={e => setCancellationAllowed(e.target.checked)} /> Cancellation Allowed</label>
            <div><button type="submit">Save Cinema</button><button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button></div>
        </form>
    );
};

const AddHallForm = ({ cinemaId, onHallAdded, onCancel }) => {
    const [hallName, setHallName] = useState('');
    const [seatConfig, setSeatConfig] = useState([{ type: 'Standard', ranges: '' }]);
    const [error, setError] = useState('');
    const seatTypes = ['Standard', 'Premium', 'Recliner', 'Sofa', 'Box'];

    const handleConfigChange = (index, field, value) => {
        const newConfig = [...seatConfig];
        newConfig[index][field] = value;
        setSeatConfig(newConfig);
        setError('');
    };

    const addSeatType = () => setSeatConfig([...seatConfig, { type: '', ranges: '' }]);
    const removeSeatType = (index) => setSeatConfig(seatConfig.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // ... (complex validation logic remains the same)
        try {
            await axiosInstance.post('/api/admin/cinema-halls', { hallName, cinemaId, seatConfig });
            toast.success('Hall and seats added successfully!');
            onHallAdded();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add hall.');
        }
    };
    const availableTypes = seatTypes.filter(t => !seatConfig.some(c => c.type === t));
    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
            <input value={hallName} onChange={e => setHallName(e.target.value)} placeholder="Hall Name" required />
            <div>
                <h4>Seat Configuration</h4>
                {seatConfig.map((config, index) => (
                    <div key={index} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                        <select value={config.type} onChange={e => handleConfigChange(index, 'type', e.target.value)} required>
                            <option value="">Select Type</option>
                            {config.type && <option value={config.type}>{config.type}</option>}
                            {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input value={config.ranges} onChange={e => handleConfigChange(index, 'ranges', e.target.value)} placeholder="Seat Numbers (e.g., 1-20, 25)" style={{ flex: 1 }} required />
                        <button type="button" onClick={() => removeSeatType(index)}>&times;</button>
                    </div>
                ))}
                {availableTypes.length > 0 && <button type="button" onClick={addSeatType}>+ Add Seat Type</button>}
            </div>
            {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
            <div><button type="submit">Save Hall & Seats</button><button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button></div>
        </form>
    );
};

const AddMovieForm = ({ onMovieAdded, onCancel }) => {
  const [formData, setFormData] = useState({ title: '', description: '', duration: '02:30:00', language: '', releaseDate: '', genre: '', rating: '7.0', ageFormat: 'UA', trailerUrl: '' });
  const [posterFile, setPosterFile] = useState(null);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setPosterFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!posterFile) return toast.error("Please select a poster image.");
    const data = new FormData();
    data.append('file', posterFile);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('duration', formData.duration);
    data.append('language', formData.language);
    data.append('releaseDate', formData.releaseDate);
    data.append('genre', formData.genre);
    data.append('rating', formData.rating);
    data.append('ageFormat', formData.ageFormat);
    data.append('trailerUrl', formData.trailerUrl);

    try {
      await axiosInstance.post('/api/admin/movie', data);
      toast.success('Movie added successfully!');
      onMovieAdded();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add movie.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
      <h4>Add New Movie</h4>
      <label>Poster Image:</label>
      <input name="posterFile" type="file" onChange={handleFileChange} accept="image/*" required />
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (HH:MM:SS)" required />
      <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" required />
      <input name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required />
      <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required />
      <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} placeholder="Rating" required />
      <input name="ageFormat" value={formData.ageFormat} onChange={handleChange} placeholder="Age Format" required />
      <input name="trailerUrl" type="url" value={formData.trailerUrl} onChange={handleChange} placeholder="Trailer URL" required />
      <div><button type="submit">Save Movie</button><button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button></div>
    </form>
  );
};

const AddShowForm = ({ hall, movies, onShowAdded, onCancel, allSeats, initialData }) => { 
    const formRef = useRef(null);
    const isEditMode = Boolean(initialData);

    const [movieId, setMovieId] = useState('');
    const [showDate, setShowDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [format, setFormat] = useState('2D');
    const [language, setLanguage] = useState('');
    
    const seatTypesInHall = [...new Set(allSeats.filter(s => s.CinemaHallID === hall.CinemaHallID).map(s => s.Seat_Type))];
    const [priceConfig, setPriceConfig] = useState(
        seatTypesInHall.reduce((acc, type) => ({ ...acc, [type]: '' }), {})
    );

    useEffect(() => {
        if (isEditMode) {
            setMovieId(initialData.MovieID);
            setShowDate(new Date(initialData.Show_Date).toISOString().split('T')[0]);
            setStartTime(new Date(initialData.StartTime).toTimeString().substring(0, 5));
            setFormat(initialData.Format);
            setLanguage(initialData.Show_Language);
            
            // In edit mode, we get prices from the `initialData.prices` object
            if (initialData.prices) {
                // Pre-fill priceConfig with existing prices
                const existingPrices = seatTypesInHall.reduce((acc, type) => {
                    return { ...acc, [type]: initialData.prices[type] || '' };
                }, {});
                setPriceConfig(existingPrices);
            } else {
                 toast.success("Editing show. Please re-enter all seat prices.");
            }
        }
    }, [initialData, isEditMode, seatTypesInHall]); // Add seatTypesInHall dependency

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (formRef.current && !formRef.current.contains(event.target)) {
                onCancel(); 
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCancel]); 


    const handlePriceChange = (type, value) => {
        setPriceConfig(prev => ({...prev, [type]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emptyPrice = Object.values(priceConfig).some(p => p === '' || p <= 0);
        if (emptyPrice) return toast.error("Please set a valid price for all seat types.");

        const showData = {
            MovieID: movieId,
            CinemaHallID: hall.CinemaHallID,
            Show_Date: showDate,
            StartTime: startTime,
            Format: format,
            Show_Language: language,
            priceConfig: priceConfig
        };

        try {
            if (isEditMode) {
                await axiosInstance.put(`/api/admin/shows/${initialData.ShowID}`, showData);
                toast.success("Show updated successfully!");
            } else {
                await axiosInstance.post('/api/admin/shows', showData);
                toast.success("Show added successfully!");
            }
            onShowAdded();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} show.`);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            <h4>{isEditMode ? `Edit Show in ${hall.Hall_Name}`: `Add New Show to ${hall.Hall_Name}`}</h4>
             <select value={movieId} onChange={e => setMovieId(e.target.value)} required>
                <option value="">Select a Movie</option>
                {movies.map(m => <option key={m.MovieID} value={m.MovieID}>{m.Title}</option>)}
            </select>
            <input type="date" value={showDate} onChange={e => setShowDate(e.target.value)} required />
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
            <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Show Language (e.g., Malayalam)" required />
            <select value={format} onChange={e => setFormat(e.target.value)} required>
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
            </select>

            <h4>{isEditMode ? "Update Seat Prices" : "Set Seat Prices"}</h4>
            {seatTypesInHall.map(type => (
                <div key={type} style={{display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center'}}>
                    <label><strong>{type}:</strong></label>
                    <input 
                        type="number" 
                        value={priceConfig[type]}
                        onChange={e => handlePriceChange(type, e.target.value)}
                        placeholder={`Price for ${type}`}
                        required 
                    />
                </div>
            ))}
            
            <div>
                <button type="submit">{isEditMode ? "Update Show" : "Save Show"}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
            </div>
        </form>
    );
};


// --- MAIN UNIFIED DASHBOARD COMPONENT ---

export default function AdminManagement() {
  // --- STATE MANAGEMENT ---
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  
  // --- REFACTORED STATE (Lazy Loaded) ---
  const [cinemas, setCinemas] = useState([]); // Replaces allCinemas
  const [halls, setHalls] = useState([]);     // Replaces allHalls
  const [shows, setShows] = useState([]);     // Replaces allShows
  const [seats, setSeats] = useState([]);     // Replaces allSeats

  // Loading state for UI feedback
  const [loading, setLoading] = useState({
      cinemas: false,
      halls: false,
      shows: false
  });

  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedHallId, setSelectedHallId] = useState(null);

  const [showAddMovieForm, setShowAddMovieForm] = useState(false);
  const [showAddCityForm, setShowAddCityForm] = useState(false);
  const [showAddCinemaForm, setShowAddCinemaForm] = useState(false);
  const [showAddHallForm, setShowAddHallForm] = useState(false);
  const [showAddShowForm, setShowAddShowForm] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  
  // --- CACHE-BUSTING CONFIG ---
  // Headers to prevent the browser from caching GET requests
  const cacheBustConfig = {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };

  // --- DATA FETCHING (REFACTORED) ---

  // Specific fetch functions for on-demand loading
  const fetchMovies = async () => {
      try {
          const res = await axiosInstance.get("/api/admin/movie", cacheBustConfig);
          setMovies(res.data.movies);
      } catch (e) { toast.error("Failed to fetch movies."); }
  };

  const fetchCities = async () => {
      try {
          const res = await axiosInstance.get("/api/admin/cities", cacheBustConfig);
          setCities(res.data.cities);
      } catch (e) { toast.error("Failed to fetch cities."); }
  };

  const fetchCinemas = async (cityId) => {
      if (!cityId) return;
      setLoading(prev => ({ ...prev, cinemas: true }));
      try {
          const res = await axiosInstance.get(`/api/admin/cinemas?cityId=${cityId}`, cacheBustConfig);
          setCinemas(res.data.cinemas);
      } catch (e) { toast.error("Failed to fetch cinemas."); }
      finally { setLoading(prev => ({ ...prev, cinemas: false })); }
  };

  const fetchHalls = async (cinemaId) => {
      if (!cinemaId) return;
      setLoading(prev => ({ ...prev, halls: true }));
      try {
          const res = await axiosInstance.get(`/api/admin/cinema-halls?cinemaId=${cinemaId}`, cacheBustConfig);
          setHalls(res.data.halls);
      } catch (e) { toast.error("Failed to fetch halls."); }
      finally { setLoading(prev => ({ ...prev, halls: false })); }
  };

  const fetchShowsAndSeats = async (hallId) => {
      if (!hallId) return;
      setLoading(prev => ({ ...prev, shows: true }));
      try {
          const [showsRes, seatsRes] = await Promise.all([
              axiosInstance.get(`/api/admin/view-shows?hallId=${hallId}`, cacheBustConfig),
              axiosInstance.get(`/api/admin/cinema-seats?hallId=${hallId}`, cacheBustConfig)
          ]);
          setShows(showsRes.data.shows);
          setSeats(seatsRes.data.seats);
      } catch (e) { toast.error("Failed to fetch hall details."); }
      finally { setLoading(prev => ({ ...prev, shows: false })); }
  };

  // --- CHAINED useEffect HOOKS ---

  // 1. Initial load: Fetch top-level items
  useEffect(() => {
    fetchMovies();
    fetchCities();
  }, []);

  // 2. When city changes: Fetch cinemas and clear all children
  useEffect(() => {
      setCinemas([]);
      setHalls([]);
      setShows([]);
      setSeats([]);
      setSelectedCinemaId(null);
      setSelectedHallId(null);
      
      if (selectedCityId) {
          fetchCinemas(selectedCityId);
      }
  }, [selectedCityId]);

  // 3. When cinema changes: Fetch halls and clear children
  useEffect(() => {
      setHalls([]);
      setShows([]);
      setSeats([]);
      setSelectedHallId(null);

      if (selectedCinemaId) {
          fetchHalls(selectedCinemaId);
      }
  }, [selectedCinemaId]);

  // 4. When hall changes: Fetch shows & seats
  useEffect(() => {
      setShows([]);
      setSeats([]);

      if (selectedHallId) {
          fetchShowsAndSeats(selectedHallId);
      }
  }, [selectedHallId]);


// --- EVENT HANDLERS (REFACTORED) ---
  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
    // No longer need to clear state here, the useEffect does it
  };
  
  const handleCinemaSelect = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
  };

  const handleDelete = async (type, id) => {
    let endpoint = '';
    switch (type) {
        case 'movie': endpoint = `/api/admin/movie/${id}`; break;
        case 'city': endpoint = `/api/admin/cities/${id}`; break;
        case 'cinema': endpoint = `/api/admin/cinemas/${id}`; break;
        case 'cinema-hall': endpoint = `/api/admin/cinema-halls/${id}`; break;
        case 'show': endpoint = `/api/admin/shows/${id}`; break;
        default: toast.error(`Unknown type: ${type}`); return;
    }
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
        await axiosInstance.delete(endpoint);
        toast.success(`${type} deleted successfully!`);

        // --- NEW REFETCH LOGIC ---
        // Only refetch the data that actually changed
        switch (type) {
            case 'movie':
                fetchMovies();
                if (selectedMovieId === id) setSelectedMovieId(null);
                break;
            case 'city':
                fetchCities();
                if (selectedCityId === id) setSelectedCityId(null);
                break;
            case 'cinema':
                fetchCinemas(selectedCityId); // Refetch cinemas for current city
                if (selectedCinemaId === id) setSelectedCinemaId(null);
                break;
            case 'cinema-hall':
                fetchHalls(selectedCinemaId); // Refetch halls for current cinema
                if (selectedHallId === id) setSelectedHallId(null);
                break;
            case 'show':
                fetchShowsAndSeats(selectedHallId); // Refetch shows for current hall
                break;
        }

    } catch (err) {
        toast.error(`Could not delete: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleEditClick = (show) => {
    setEditingShow(show);
    setShowAddShowForm(true); // Open the form
  };

  const handleCancelForm = () => {
      setShowAddShowForm(false);
      setEditingShow(null); // Clear editing state on cancel
  };

  // --- NEW SPECIFIC "ADDED" HANDLERS ---
  const handleMovieAdded = () => {
      fetchMovies();
      setShowAddMovieForm(false);
  };
  const handleCityAdded = () => {
      fetchCities();
      setShowAddCityForm(false);
  };
  const handleCinemaAdded = () => {
      fetchCinemas(selectedCityId); // Only refetch cinemas for the current city
      setShowAddCinemaForm(false);
  };
  const handleHallAdded = () => {
      fetchHalls(selectedCinemaId); // Only refetch halls for the current cinema
      setShowAddHallForm(false);
  };
  const handleShowAdded = () => {
      fetchShowsAndSeats(selectedHallId); // Only refetch shows for the current hall
      setShowAddShowForm(false);
      setEditingShow(null);
  };

  const handleToggleShowStatus = async (showId, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await axiosInstance.put(`/api/admin/shows/${showId}/status`, { isActive: newStatus });
      toast.success(`Show booking status updated to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
      
      // --- NEW REFETCH LOGIC ---
      fetchShowsAndSeats(selectedHallId); // Only refetch shows for this hall

    } catch (err) {
      toast.error("Failed to update show status.");
    }
  };

  // --- FILTERED DATA & SELECTED OBJECTS ---
  // Selected objects are still needed for titles and details
  const selectedMovie = selectedMovieId ? movies.find(m => m.MovieID === parseInt(selectedMovieId)) : null;
  const selectedCity = selectedCityId ? cities.find(c => c.CityID === parseInt(selectedCityId)) : null;
  const selectedCinema = selectedCinemaId ? cinemas.find(c => c.CinemaID === parseInt(selectedCinemaId)) : null;
  const selectedHall = selectedHallId ? halls.find(h => h.CinemaHallID === parseInt(selectedHallId)) : null;
  
  // No more "filtered..." variables are needed
  
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Management</h1>

      {/* --- MOVIE MANAGEMENT SECTION --- */}
      <ManagementSection title="Movie Management">
        <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
                {movies.map(movie => (
                    <div key={movie.MovieID} onClick={() => setSelectedMovieId(movie.MovieID)} style={{ padding: '10px', cursor: 'pointer', background: selectedMovieId == movie.MovieID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{movie.Title}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete('movie', movie.MovieID); }} style={{background:'red', color:'white'}}>Delete</button>
                    </div>
                ))}
                {!showAddMovieForm ? (
                    <button onClick={() => setShowAddMovieForm(true)} style={{marginTop: '10px'}}>+ Add New Movie</button>
                ) : (
                    /* UPDATED PROP */
                    <AddMovieForm onMovieAdded={handleMovieAdded} onCancel={() => setShowAddMovieForm(false)} />
                )}
            </div>
            <div style={{flex: 1}}>
                {selectedMovie ? <MovieDetails movie={selectedMovie} /> : <p>Select a movie to see details.</p>}
            </div>
        </div>
      </ManagementSection>

      {/* --- THEATER MANAGEMENT SECTIONS --- */}
      <ManagementSection title="Theater Management: Cities">
        <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
                {cities.map(city => (
                    <div key={city.CityID} onClick={() => handleCitySelect(city.CityID)} style={{ padding: '10px', cursor: 'pointer', background: selectedCityId == city.CityID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{city.City_Name}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete('city', city.CityID); }} style={{background:'red', color:'white'}}>Delete</button>
                    </div>
                ))}
                {/* UPDATED PROP */}
                {!showAddCityForm ? <button onClick={() => setShowAddCityForm(true)} style={{marginTop: '10px'}}>+ Add City</button> : <AddCityForm onCityAdded={handleCityAdded} onCancel={() => setShowAddCityForm(false)} />}
            </div>
            {selectedCity && <div style={{flex: 1}}><CityDetails city={selectedCity} /></div>}
        </div>
      </ManagementSection>

      {selectedCityId && (
        <ManagementSection title={`Cinemas in ${selectedCity?.City_Name}`}>
            { loading.cinemas && <p>Loading cinemas...</p> }
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {/* UPDATED: Use `cinemas` state directly */}
                    {cinemas.map(cinema => (
                        <div key={cinema.CinemaID} onClick={() => handleCinemaSelect(cinema.CinemaID)} style={{ padding: '10px', cursor: 'pointer', background: selectedCinemaId == cinema.CinemaID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{cinema.Cinema_Name}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema', cinema.CinemaID); }} style={{background:'red', color:'white'}}>Delete</button>
                        </div>
                    ))}
                    {/* UPDATED PROP */}
                    {!showAddCinemaForm ? <button onClick={() => setShowAddCinemaForm(true)} style={{marginTop: '10px'}}>+ Add Cinema</button> : <AddCinemaForm cityId={selectedCityId} onCinemaAdded={handleCinemaAdded} onCancel={() => setShowAddCinemaForm(false)} />}
                </div>
                {selectedCinema && <div style={{flex: 1}}><CinemaDetails cinema={selectedCinema} /></div>}
            </div>
        </ManagementSection>
      )}

      {selectedCinemaId && (
        <ManagementSection title={`Halls in ${selectedCinema?.Cinema_Name}`}>
            { loading.halls && <p>Loading halls...</p> }
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {/* UPDATED: Use `halls` state directly */}
                    {halls.map(hall => (
                        <div key={hall.CinemaHallID} onClick={() => setSelectedHallId(hall.CinemaHallID)} style={{ padding: '10px', cursor: 'pointer', background: selectedHallId == hall.CinemaHallID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{hall.Hall_Name}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema-hall', hall.CinemaHallID); }} style={{background:'red', color:'white'}}>Delete</button>
                        </div>
                    ))}
                    {/* UPDATED PROP */}
                    {!showAddHallForm ? <button onClick={() => setShowAddHallForm(true)} style={{marginTop: '10px'}}>+ Add Hall</button> : <AddHallForm cinemaId={selectedCinemaId} onHallAdded={handleHallAdded} onCancel={() => setShowAddHallForm(false)} />}
                </div>
                {/* UPDATED: Pass `seats` state instead of `allSeats` */}
                {selectedHall && <div style={{flex: 1}}><HallDetails hall={selectedHall} allSeats={seats} /></div>}
            </div>
        </ManagementSection>
      )}

      {selectedHallId && (
<ManagementSection title={`Shows in ${selectedHall?.Hall_Name}`}>
    { loading.shows && <p>Loading shows...</p> }
    {/* UPDATED: Use `shows` state directly */}
    {shows.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: 'collapse', tableLayout: 'fixed' }}>
    <thead>
        <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '25%' }}>Movie</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '25%' }}>Date & Time</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Format</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Language</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '20%' }}>Seat Prices</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Start Booking</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
        </tr>
    </thead>
    <tbody>
        {/* UPDATED: Map `shows` state */}
        {shows.map(s => (
        <tr key={s.ShowID}>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.Title}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {new Date(s.Show_Date).toLocaleDateString()} at {new Date(s.StartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.Format}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.Show_Language}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {s.prices ? (
                    Object.entries(s.prices).map(([type, price]) => (
                        <div key={type} style={{display: 'flex', justifyContent: 'space-between'}}>
                           <span>{type}:</span>
                           <strong>₹{parseFloat(price).toFixed(2)}</strong>
                        </div>
                    ))
                ) : (
                    <span style={{color: '#888'}}>Not Set</span>
                )}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input 
                        type="checkbox"
                        checked={Boolean(s.isActive)} 
                        onChange={() => handleToggleShowStatus(s.ShowID, s.isActive)}
                        style={{ height: '18px', width: '18px' }}
                    />
                    <span style={{ marginLeft: '8px' }}>
                        {s.isActive ? 'Active' : 'Inactive'}
                    </span>
                </label>
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd', display: 'flex', gap: '5px' }}>
                <button onClick={() => handleEditClick(s)} style={{background: 'blue', color: 'white', cursor: 'pointer'}}>Edit</button>
                <button onClick={() => handleDelete('show', s.ShowID)} style={{background:'red', color: 'white', cursor: 'pointer'}}>Delete</button>
            </td>
        </tr>
        ))}
    </tbody>
</table>
    ): !loading.shows && <p>No shows scheduled for this hall.</p>}

    {!showAddShowForm ? (
        <button onClick={() => setShowAddShowForm(true)} style={{marginTop: '10px'}}>+ Add Show</button>
    ) : (
        <AddShowForm 
            hall={selectedHall} 
            movies={movies}
            allSeats={seats} /* UPDATED: Pass `seats` state */
            initialData={editingShow}
            onShowAdded={handleShowAdded} /* UPDATED PROP */
            onCancel={handleCancelForm}
        />
    )}
</ManagementSection>
)}
    </div>
  );
}