import React, { useState, useEffect , useRef} from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';

// --- REUSABLE & DETAIL COMPONENTS ---

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

// ... (CinemaDetails and HallDetails components remain the same as before)
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
// ... (AddCityForm, AddCinemaForm, AddHallForm remain the same as before) ...
const AddCityForm = ({ onCityAdded, onCancel }) => {
  const [cityName, setCityName] = useState('');
  const [cityState, setCityState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/cities', { cityName, cityState, zipCode });
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
            await axiosInstance.post('/admin/cinemas', { name: cinemaName, cityId, facilities, cancellationAllowed });
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
            await axiosInstance.post('/admin/cinema-halls', { hallName, cinemaId, seatConfig });
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
      await axiosInstance.post('/admin/movie', data);
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
    // Determine if we are in "edit" mode
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

    // NEW: useEffect to populate form when in edit mode
    useEffect(() => {
        if (isEditMode) {
            setMovieId(initialData.MovieID);
            // Dates and times need careful formatting to work with input fields
            setShowDate(new Date(initialData.Show_Date).toISOString().split('T')[0]);
            setStartTime(new Date(initialData.StartTime).toTimeString().substring(0, 5));
            setFormat(initialData.Format);
            setLanguage(initialData.Show_Language);

            // Fetch prices for the existing show to populate price fields
            const fetchShowPrices = async () => {
                try {
                    toast.success("Editing show. Please re-enter all seat prices.");
                } catch (error) {
                    toast.error("Could not fetch existing prices.");
                }
            };
            fetchShowPrices();
        }
    }, [initialData, isEditMode]);

    useEffect(() => {
        // Function to handle clicks
        const handleClickOutside = (event) => {
            // If the ref is attached and the click was not inside the form
            if (formRef.current && !formRef.current.contains(event.target)) {
                onCancel(); // Call the onCancel function passed in props
            }
        };

        // Add the event listener to the whole document
        document.addEventListener("mousedown", handleClickOutside);

        // This is the cleanup function that removes the listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onCancel]); // The effect depends on the onCancel function


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
                // UPDATE request
                await axiosInstance.put(`/admin/shows/${initialData.ShowID}`, showData);
                toast.success("Show updated successfully!");
            } else {
                // CREATE request
                await axiosInstance.post('/admin/shows', showData);
                toast.success("Show added successfully!");
            }
            onShowAdded();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} show.`);
        }
    };

    return (
        <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
            {/* Change title based on mode */}
            <h4>{isEditMode ? `Edit Show in ${hall.Hall_Name}`: `Add New Show to ${hall.Hall_Name}`}</h4>
            {/* ... rest of the form is the same ... */}
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
  const [allCinemas, setAllCinemas] = useState([]);
  const [allHalls, setAllHalls] = useState([]);
  const [allShows, setAllShows] = useState([]);
  const [allSeats, setAllSeats] = useState([]);

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
  
  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      const [moviesRes, citiesRes, cinemasRes, hallsRes, showsRes, seatsRes] = await Promise.all([
        axiosInstance.get("/admin/movie"),
        axiosInstance.get("/admin/cities"),
        axiosInstance.get("/admin/cinemas"),
        axiosInstance.get("/admin/cinema-halls"),
        axiosInstance.get("/admin/view-shows"),
        axiosInstance.get("/admin/cinema-seats")
      ]);
      setMovies(moviesRes.data.movies);
      setCities(citiesRes.data.cities);
      setAllCinemas(cinemasRes.data.cinemas);
      setAllHalls(hallsRes.data.halls);
      setAllShows(showsRes.data.shows);
      setAllSeats(seatsRes.data.seats);
    } catch (error) {
      toast.error("Failed to fetch all management data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

// --- EVENT HANDLERS ---
  const handleCitySelect = (cityId) => {
    setSelectedCityId(cityId);
    setSelectedCinemaId(null);
    setSelectedHallId(null);
  };
  
  const handleCinemaSelect = (cinemaId) => {
    setSelectedCinemaId(cinemaId);
    setSelectedHallId(null);
  };

  const handleDelete = async (type, id) => {
    let endpoint = '';
    switch (type) {
        case 'movie': endpoint = `/admin/movie/${id}`; break;
        case 'city': endpoint = `/admin/cities/${id}`; break;
        case 'cinema': endpoint = `/admin/cinemas/${id}`; break;
        case 'cinema-hall': endpoint = `/admin/cinema-halls/${id}`; break;
        case 'show': endpoint = `/admin/shows/${id}`; break;
        default: toast.error(`Unknown type: ${type}`); return;
    }
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
        await axiosInstance.delete(endpoint);
        toast.success(`${type} deleted successfully!`);
        fetchData();
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

  // Correct, single definition of handleDataAdded
  const handleDataAdded = (formSetter) => {
      fetchData();
      formSetter(false);
      setEditingShow(null); // Clear editing state on success
  };

    const handleToggleShowStatus = async (showId, currentStatus) => {
    const newStatus = !currentStatus; // Invert the current status
    try {
      // You will need to create this backend endpoint: PUT /admin/shows/:id/status
      await axiosInstance.put(`/admin/shows/${showId}/status`, { isActive: newStatus });
      toast.success(`Show booking status updated to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
      
      // OPTION 1 (Simple): Refetch all data to see the change
      fetchData(); 

      // OPTION 2 (Advanced): Update state directly for a faster UI response
      // setAllShows(prevShows => 
      //   prevShows.map(show => 
      //     show.ShowID === showId ? { ...show, isActive: newStatus } : show
      //   )
      // );

    } catch (err) {
      toast.error("Failed to update show status.");
    }
  };

  // --- FILTERED DATA & SELECTED OBJECTS ---
  const selectedMovie = selectedMovieId ? movies.find(m => m.MovieID === parseInt(selectedMovieId)) : null;
  const filteredCinemas = selectedCityId ? allCinemas.filter(c => c.CityID === parseInt(selectedCityId)) : [];
  const selectedCity = selectedCityId ? cities.find(c => c.CityID === parseInt(selectedCityId)) : null;
  const filteredHalls = selectedCinemaId ? allHalls.filter(h => h.CinemaID === parseInt(selectedCinemaId)) : [];
  const selectedCinema = selectedCinemaId ? allCinemas.find(c => c.CinemaID === parseInt(selectedCinemaId)) : null;
  const filteredShows = selectedHallId ? allShows.filter(s => s.CinemaHallID === parseInt(selectedHallId)) : [];
  const selectedHall = selectedHallId ? allHalls.find(h => h.CinemaHallID === parseInt(selectedHallId)) : null;
  
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
                    <AddMovieForm onMovieAdded={() => handleDataAdded(setShowAddMovieForm)} onCancel={() => setShowAddMovieForm(false)} />
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
                {!showAddCityForm ? <button onClick={() => setShowAddCityForm(true)} style={{marginTop: '10px'}}>+ Add City</button> : <AddCityForm onCityAdded={() => handleDataAdded(setShowAddCityForm)} onCancel={() => setShowAddCityForm(false)} />}
            </div>
            {selectedCity && <div style={{flex: 1}}><CityDetails city={selectedCity} /></div>}
        </div>
      </ManagementSection>

      {selectedCityId && (
        <ManagementSection title={`Cinemas in ${selectedCity?.City_Name}`}>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {filteredCinemas.map(cinema => (
                        <div key={cinema.CinemaID} onClick={() => handleCinemaSelect(cinema.CinemaID)} style={{ padding: '10px', cursor: 'pointer', background: selectedCinemaId == cinema.CinemaID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{cinema.Cinema_Name}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema', cinema.CinemaID); }} style={{background:'red', color:'white'}}>Delete</button>
                        </div>
                    ))}
                    {!showAddCinemaForm ? <button onClick={() => setShowAddCinemaForm(true)} style={{marginTop: '10px'}}>+ Add Cinema</button> : <AddCinemaForm cityId={selectedCityId} onCinemaAdded={() => handleDataAdded(setShowAddCinemaForm)} onCancel={() => setShowAddCinemaForm(false)} />}
                </div>
                {selectedCinema && <div style={{flex: 1}}><CinemaDetails cinema={selectedCinema} /></div>}
            </div>
        </ManagementSection>
      )}

      {selectedCinemaId && (
        <ManagementSection title={`Halls in ${selectedCinema?.Cinema_Name}`}>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {filteredHalls.map(hall => (
                        <div key={hall.CinemaHallID} onClick={() => setSelectedHallId(hall.CinemaHallID)} style={{ padding: '10px', cursor: 'pointer', background: selectedHallId == hall.CinemaHallID ? '#eef4ff' : 'transparent', border: '1px solid #ddd', marginBottom:'5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{hall.Hall_Name}</span>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema-hall', hall.CinemaHallID); }} style={{background:'red', color:'white'}}>Delete</button>
                        </div>
                    ))}
                    {!showAddHallForm ? <button onClick={() => setShowAddHallForm(true)} style={{marginTop: '10px'}}>+ Add Hall</button> : <AddHallForm cinemaId={selectedCinemaId} onHallAdded={() => handleDataAdded(setShowAddHallForm)} onCancel={() => setShowAddHallForm(false)} />}
                </div>
                {selectedHall && <div style={{flex: 1}}><HallDetails hall={selectedHall} allSeats={allSeats} /></div>}
            </div>
        </ManagementSection>
      )}

      {selectedHallId && (
<ManagementSection title={`Shows in ${selectedHall?.Hall_Name}`}>
    {filteredShows.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: 'collapse', tableLayout: 'fixed' }}>
    <thead>
        <tr style={{ background: '#f4f4f4' }}>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '25%' }}>Movie</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '25%' }}>Date & Time</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Format</th>
            {/* New Header for Language */}
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Language</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left', width: '20%' }}>Seat Prices</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Start Booking</th>
            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
        </tr>
    </thead>
    <tbody>
        {filteredShows.map(s => (
        <tr key={s.ShowID}>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.Title}</td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                {new Date(s.Show_Date).toLocaleDateString()} at {new Date(s.StartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </td>
            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{s.Format}</td>
            
            {/* New Cell to Display Language */}
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
                                    checked={Boolean(s.isActive)} // Ensure it's a boolean
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
    ): <p>No shows scheduled for this hall.</p>}

    {!showAddShowForm ? (
        <button onClick={() => setShowAddShowForm(true)} style={{marginTop: '10px'}}>+ Add Show</button>
    ) : (
        <AddShowForm 
            hall={selectedHall} 
            movies={movies}
            allSeats={allSeats}
            initialData={editingShow} // Pass the show to be edited
            onShowAdded={() => handleDataAdded(setShowAddShowForm)}
            onCancel={handleCancelForm} // Use the updated cancel handler
        />
    )}
</ManagementSection>
)}
    </div>
  );
}
