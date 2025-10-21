import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';

// --- (1) HELPER HOOK & COMPONENTS ---

// Debounce hook for search inputs
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Simple Modal Component
const Modal = ({ children, onClose }) => {
    const modalRef = useRef();
    
    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent} ref={modalRef}>
                <button onClick={onClose} style={styles.modalCloseButton}>&times;</button>
                {children}
            </div>
        </div>
    );
};

// Simple Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
                &laquo; Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next &raquo;
            </button>
        </div>
    );
};


// --- (2) REUSABLE & DETAIL COMPONENTS ---
// (No changes to ManagementSection, MovieDetails, CityDetails, CinemaDetails, HallDetails)
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
            {Object.keys(seatConfig).length > 0 ? (
                <ul>
                    {Object.entries(seatConfig).map(([type, numbers]) => (
                        <li key={type}><strong>{type}:</strong> {numbers.length} seats ({summarizeRanges(numbers)})</li>
                    ))}
                </ul>
            ) : <p>No seats found for this hall.</p>}
        </div>
    );
};


// --- (3) REUSABLE FORM COMPONENTS (Handle Add & Edit) ---

const CityForm = ({ onSave, onCancel, initialData }) => {
  const isEditMode = Boolean(initialData);
  const [cityName, setCityName] = useState(initialData?.City_Name || '');
  const [cityState, setCityState] = useState(initialData?.City_State || '');
  const [zipCode, setZipCode] = useState(initialData?.ZipCode || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = { City_Name: cityName, City_State: cityState, ZipCode: zipCode };
        if (isEditMode) {
            await axiosInstance.put(`/api/admin/city/${initialData.CityID}`, payload);
            toast.success('City updated successfully!');
        } else {
            await axiosInstance.post('/api/admin/cities', { cityName, cityState, zipCode });
            toast.success('City added successfully!');
        }
        onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} city.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
      <h4>{isEditMode ? 'Edit City' : 'Add New City'}</h4>
      <input value={cityName} onChange={e => setCityName(e.target.value)} placeholder="City Name" required />
      <input value={cityState} onChange={e => setCityState(e.target.value)} placeholder="State" required />
      <input value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="Zip Code" required />
      <div>
        <button type="submit">{isEditMode ? 'Update City' : 'Save City'}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
      </div>
    </form>
  );
};

const CinemaForm = ({ cityId, onSave, onCancel, initialData }) => {
    const isEditMode = Boolean(initialData);
    const [cinemaName, setCinemaName] = useState(initialData?.Cinema_Name || '');
    const [facilities, setFacilities] = useState(initialData?.Facilities || '');
    const [cancellationAllowed, setCancellationAllowed] = useState(initialData?.Cancellation_Allowed || false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { 
                Cinema_Name: cinemaName, 
                facilities, 
                cancellationAllowed,
                cityId: initialData?.CityID || cityId // Use initial data's cityId if editing
            };

            if (isEditMode) {
                // Don't send cityId in PUT payload, not editable
                const updatePayload = { Cinema_Name: cinemaName, Facilities: facilities, Cancellation_Allowed: cancellationAllowed };
                await axiosInstance.put(`/api/admin/cinema/${initialData.CinemaID}`, updatePayload);
                toast.success('Cinema updated successfully!');
            } else {
                // Send 'name' as key for add
                await axiosInstance.post('/api/admin/cinemas', { name: cinemaName, cityId, facilities, cancellationAllowed });
                toast.success('Cinema added successfully!');
            }
            onSave();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} cinema.`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
            <h4>{isEditMode ? 'Edit Cinema' : 'Add New Cinema'}</h4>
            <input value={cinemaName} onChange={e => setCinemaName(e.target.value)} placeholder="Cinema Name" required />
            <input value={facilities} onChange={e => setFacilities(e.target.value)} placeholder="Facilities (e.g., Parking,Dolby)" />
            <label><input type="checkbox" checked={cancellationAllowed} onChange={e => setCancellationAllowed(e.target.checked)} /> Cancellation Allowed</label>
            <div>
                <button type="submit">{isEditMode ? 'Update Cinema' : 'Save Cinema'}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
            </div>
        </form>
    );
};

const HallForm = ({ cinemaId, onSave, onCancel, initialData }) => {
    const isEditMode = Boolean(initialData);
    const [hallName, setHallName] = useState(initialData?.Hall_Name || '');
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
        try {
            if (isEditMode) {
                // ONLY update hall name. Seat editing is too complex.
                await axiosInstance.put(`/api/admin/cinema-hall/${initialData.CinemaHallID}`, { Hall_Name: hallName });
                toast.success('Hall name updated successfully!');
            } else {
                // ... (complex validation logic for add)
                await axiosInstance.post('/api/admin/cinema-halls', { hallName, cinemaId, seatConfig });
                toast.success('Hall and seats added successfully!');
            }
            onSave();
        } catch (err) {
            toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} hall.`);
        }
    };
    const availableTypes = seatTypes.filter(t => !seatConfig.some(c => c.type === t));
    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
            <h4>{isEditMode ? 'Edit Hall Name' : 'Add New Hall'}</h4>
            <input value={hallName} onChange={e => setHallName(e.target.value)} placeholder="Hall Name" required />
            
            {/* Only show seat config for ADD mode */}
            {!isEditMode && (
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
            )}
            {isEditMode && <p><i>Note: Seat configuration cannot be edited. To change seats, please delete and re-create the hall.</i></p>}

            {error && <p style={{ color: 'red', margin: 0 }}>{error}</p>}
            <div>
                <button type="submit">{isEditMode ? 'Update Hall' : 'Save Hall & Seats'}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
            </div>
        </form>
    );
};

const MovieForm = ({ onSave, onCancel, initialData }) => {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState({
      title: initialData?.Title || '',
      description: initialData?.Movie_Description || '',
      duration: initialData?.Duration || '02:30:00',
      language: initialData?.Movie_Language || '',
      releaseDate: initialData?.ReleaseDate ? new Date(initialData.ReleaseDate).toISOString().split('T')[0] : '',
      genre: initialData?.Genre || '',
      rating: initialData?.Rating || '7.0',
      ageFormat: initialData?.Age_Format || 'UA',
      trailerUrl: initialData?.Trailer_URL || ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setPosterFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In ADD mode, file is required
    if (!isEditMode && !posterFile) {
        return toast.error("Please select a poster image.");
    }

    setIsUploading(true);

    try {
        // --- This is now the *only* logic you need ---
        
        // 1. Create FormData
        const data = new FormData();
        
        // 2. Append all text fields
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('duration', formData.duration);
        data.append('language', formData.language);
        data.append('releaseDate', formData.releaseDate);
        data.append('genre', formData.genre);
        data.append('rating', formData.rating);
        data.append('ageFormat', formData.ageFormat);
        data.append('trailerUrl', formData.trailerUrl);

        // 3. Append the new file *only if* one was selected
        if (posterFile) {
            data.append('file', posterFile);
        } else if (isEditMode) {
            // If no new file, send back the old URL
            // (Your `editMovie` controller handles this)
            data.append('imageUrl', initialData.Poster_Image_URL);
        }

        // 4. Send the request
        if (isEditMode) {
            // Send FormData to the PUT route
            await axiosInstance.put(`/api/admin/movie/${initialData.MovieID}`, data);
            toast.success('Movie updated successfully!');
        } else {
            // Send FormData to the POST route
            await axiosInstance.post('/api/admin/movie', data);
            toast.success('Movie added successfully!');
        }

        setIsUploading(false);
        onSave();

    } catch (err) {
        setIsUploading(false);
        toast.error(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} movie.`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '10px', marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
      <h4>{isEditMode ? 'Edit Movie' : 'Add New Movie'}</h4>
      
      <label>Poster Image:</label>
      {isEditMode && <img src={initialData.Poster_Image_URL} alt="poster" style={{width: '100px'}} />}
      <input name="posterFile" type="file" onChange={handleFileChange} accept="image/*" required={!isEditMode} />
      {isEditMode && <small>Select a new file to replace the current poster (Note: This is a demo limitation).</small>}
      
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <input name="duration" value={formData.duration} onChange={handleChange} placeholder="Duration (HH:MM:SS)" required />
      <input name="language" value={formData.language} onChange={handleChange} placeholder="Language" required />
      <input name="releaseDate" type="date" value={formData.releaseDate} onChange={handleChange} required />
      <input name="genre" value={formData.genre} onChange={handleChange} placeholder="Genre" required />
      <input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} placeholder="Rating" required />
      <input name="ageFormat" value={formData.ageFormat} onChange={handleChange} placeholder="Age Format" required />
      <input name="trailerUrl" type="url" value={formData.trailerUrl} onChange={handleChange} placeholder="Trailer URL" required />
      
      <div>
        <button type="submit" disabled={isUploading}>{isUploading ? 'Saving...' : (isEditMode ? 'Update Movie' : 'Save Movie')}</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
      </div>
    </form>
  );
};

// ShowForm (from your file) is already reusable with `initialData`
const AddShowForm = ({ hall, movies, onShowAdded, onCancel, allSeats, initialData }) => { 
    // ... (Your existing AddShowForm is perfect as-is)
    const formRef = useRef(null);
    const isEditMode = Boolean(initialData);
    const [movieId, setMovieId] = useState('');
    const [showDate, setShowDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [format, setFormat] = useState('2D');
    const [language, setLanguage] = useState('');
    const [seatTypesInHall, setSeatTypesInHall] = useState([]);
    const [priceConfig, setPriceConfig] = useState({});

    // Deriving seat types
    useEffect(() => {
        const types = [...new Set(allSeats.filter(s => s.CinemaHallID === hall.CinemaHallID).map(s => s.Seat_Type))];
        setSeatTypesInHall(types);
        
        // Initialize priceConfig based on types
        const initialPrices = types.reduce((acc, type) => ({ ...acc, [type]: '' }), {});
        
        if (isEditMode && initialData?.prices) {
             const existingPrices = types.reduce((acc, type) => {
                return { ...acc, [type]: initialData.prices[type] || '' };
            }, {});
            setPriceConfig(existingPrices);
        } else {
            setPriceConfig(initialPrices);
        }

        // Set form data
        if (isEditMode) {
            setMovieId(initialData.MovieID);
            setShowDate(new Date(initialData.Show_Date).toISOString().split('T')[0]);
            setStartTime(new Date(initialData.StartTime).toTimeString().substring(0, 5));
            setFormat(initialData.Format);
            setLanguage(initialData.Show_Language);
        }

    }, [allSeats, hall.CinemaHallID, initialData, isEditMode]);


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
        if (emptyPrice && seatTypesInHall.length > 0) return toast.error("Please set a valid price for all seat types.");

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
                {/* Use the full movie list passed from parent */}
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
            {seatTypesInHall.length > 0 ? seatTypesInHall.map(type => (
                <div key={type} style={{display: 'grid', gridTemplateColumns: '100px 1fr', alignItems: 'center'}}>
                    <label><strong>{type}:</strong></label>
                    <input 
                        type="number" 
                        value={priceConfig[type] || ''}
                        onChange={e => handlePriceChange(type, e.target.value)}
                        placeholder={`Price for ${type}`}
                        required 
                    />
                </div>
            )) : <p>No seat types found for this hall.</p>}
            
            <div>
                <button type="submit">{isEditMode ? "Update Show" : "Save Show"}</button>
                <button type="button" onClick={onCancel} style={{ marginLeft: '8px' }}>Cancel</button>
            </div>
        </form>
    );
};


// --- (4) MAIN ADMIN COMPONENT ---

export default function AdminManagement() {
  // --- STATE MANAGEMENT ---
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [halls, setHalls] = useState([]);
  const [shows, setShows] = useState([]);
  const [seats, setSeats] = useState([]);
  
  // Store all movies for filter dropdowns
  const [allMovies, setAllMovies] = useState([]); 

  const [loading, setLoading] = useState({
      movies: false, cities: false, cinemas: false, halls: false, shows: false
  });

  // State for selections
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedCityId, setSelectedCityId] = useState(null);
  const [selectedCinemaId, setSelectedCinemaId] = useState(null);
  const [selectedHallId, setSelectedHallId] = useState(null);

  // State for forms/modals
  const [showAddForm, setShowAddForm] = useState(null); // 'movie', 'city', 'cinema', 'hall'
  const [editingItem, setEditingItem] = useState(null); // { type: 'movie', data: {...} }
  const [editingShow, setEditingShow] = useState(null); // For the special case show form
  const [showAddShowForm, setShowAddShowForm] = useState(false);

  // --- NEW STATE for Search, Filter, Sort, Pagination ---
  const [movieParams, setMovieParams] = useState({ search: '', genre: '', language: '', minRating: '', sortKey: 'ReleaseDate', sortOrder: 'DESC', page: 1, limit: 5 });
  const [cityParams, setCityParams] = useState({ search: '', sortKey: 'City_Name', sortOrder: 'ASC', page: 1, limit: 10 });
  const [cinemaParams, setCinemaParams] = useState({ search: '', facilities: '', cancellation: '', sortKey: 'Cinema_Name', sortOrder: 'ASC', page: 1, limit: 10 });
  const [showParams, setShowParams] = useState({ movieId: '', date: '', language: '', status: '', sortKey: 'ms.StartTime', sortOrder: 'DESC', page: 1, limit: 10 });

  const [pagination, setPagination] = useState({
      movies: {}, cities: {}, cinemas: {}, shows: {}
  });

  // Debounced search terms
  const debouncedMovieSearch = useDebounce(movieParams.search, 500);
  const debouncedCitySearch = useDebounce(cityParams.search, 500);
  const debouncedCinemaSearch = useDebounce(cinemaParams.search, 500);

  // --- CACHE-BUSTING CONFIG ---
  const cacheBustConfig = {
    headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
  };

  // --- (5) DATA FETCHING (REFACTORED) ---

  const fetchMovies = async () => {
      setLoading(prev => ({ ...prev, movies: true }));
      try {
          const params = new URLSearchParams({ ...movieParams, search: debouncedMovieSearch });
          const res = await axiosInstance.get(`/api/admin/movie?${params.toString()}`, cacheBustConfig);
          setMovies(res.data.movies);
          setPagination(prev => ({...prev, movies: res.data.pagination}));
      } catch (e) { toast.error("Failed to fetch movies."); }
      finally { setLoading(prev => ({ ...prev, movies: false })); }
  };
  
  const fetchAllMovies = async () => {
      // For dropdowns, no pagination needed
      try {
          const res = await axiosInstance.get(`/api/admin/movie?limit=1000`, cacheBustConfig);
          setAllMovies(res.data.movies);
      } catch (e) { toast.error("Failed to fetch movie list for filters."); }
  };

  const fetchCities = async () => {
      setLoading(prev => ({ ...prev, cities: true }));
      try {
          const params = new URLSearchParams({ ...cityParams, search: debouncedCitySearch });
          const res = await axiosInstance.get(`/api/admin/cities?${params.toString()}`, cacheBustConfig);
          setCities(res.data.cities);
          setPagination(prev => ({...prev, cities: res.data.pagination}));
      } catch (e) { toast.error("Failed to fetch cities."); }
      finally { setLoading(prev => ({ ...prev, cities: false })); }
  };

  const fetchCinemas = async (cityId) => {
      if (!cityId) return;
      setLoading(prev => ({ ...prev, cinemas: true }));
      try {
          const params = new URLSearchParams({ ...cinemaParams, cityId, search: debouncedCinemaSearch });
          const res = await axiosInstance.get(`/api/admin/cinemas?${params.toString()}`, cacheBustConfig);
          setCinemas(res.data.cinemas);
           setPagination(prev => ({...prev, cinemas: res.data.pagination}));
      } catch (e) { toast.error("Failed to fetch cinemas."); }
      finally { setLoading(prev => ({ ...prev, cinemas: false })); }
  };

  const fetchHalls = async (cinemaId) => {
      if (!cinemaId) return;
      setLoading(prev => ({ ...prev, halls: true }));
      try {
          // Note: Hall pagination is not fully implemented in UI, but supported by backend
          const res = await axiosInstance.get(`/api/admin/cinema-halls?cinemaId=${cinemaId}`, cacheBustConfig);
          setHalls(res.data.halls);
          // setPagination(prev => ({...prev, halls: res.data.pagination}));
      } catch (e) { toast.error("Failed to fetch halls."); }
      finally { setLoading(prev => ({ ...prev, halls: false })); }
  };

  const fetchShowsAndSeats = async (hallId) => {
      if (!hallId) return;
      setLoading(prev => ({ ...prev, shows: true }));
      try {
          const showSearch = new URLSearchParams({ ...showParams, hallId });
          const [showsRes, seatsRes] = await Promise.all([
              axiosInstance.get(`/api/admin/view-shows?${showSearch.toString()}`, cacheBustConfig),
              axiosInstance.get(`/api/admin/cinema-seats?hallId=${hallId}`, cacheBustConfig)
          ]);
          setShows(showsRes.data.shows);
          setSeats(seatsRes.data.seats);
          setPagination(prev => ({...prev, shows: showsRes.data.pagination}));
      } catch (e) { toast.error("Failed to fetch hall details."); }
      finally { setLoading(prev => ({ ...prev, shows: false })); }
  };

  // --- (6) CHAINED useEffect HOOKS (REFACTORED) ---

  // 1. Initial load:
  useEffect(() => {
    fetchAllMovies(); // Get all movies for dropdowns
  }, []);
  
  // Re-fetch whenever params change
  useEffect(() => { fetchMovies(); }, [debouncedMovieSearch, movieParams.genre, movieParams.language, movieParams.minRating, movieParams.sortKey, movieParams.sortOrder, movieParams.page]);
  useEffect(() => { fetchCities(); }, [debouncedCitySearch, cityParams.sortKey, cityParams.sortOrder, cityParams.page]);
  
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
  }, [selectedCityId, debouncedCinemaSearch, cinemaParams.facilities, cinemaParams.cancellation, cinemaParams.sortKey, cinemaParams.sortOrder, cinemaParams.page]);

  // 3. When cinema changes: Fetch halls and clear children
  useEffect(() => {
      setHalls([]);
      setShows([]);
      setSeats([]);
      setSelectedHallId(null);

      if (selectedCinemaId) {
          fetchHalls(selectedCinemaId);
      }
  }, [selectedCinemaId]); // Re-fetch only when cinema selection changes

  // 4. When hall changes: Fetch shows & seats
  useEffect(() => {
      setShows([]);
      setSeats([]);

      if (selectedHallId) {
          fetchShowsAndSeats(selectedHallId);
      }
  }, [selectedHallId, showParams.movieId, showParams.date, showParams.language, showParams.status, showParams.sortKey, showParams.sortOrder, showParams.page]);


// --- (7) EVENT HANDLERS (REFACTORED) ---
  
  // Parameter change handlers
  const handleParamChange = (setter, key, value) => {
      setter(prev => ({ ...prev, [key]: value, page: 1 })); // Reset to page 1 on any filter/search change
  };

  const handlePageChange = (type, newPage) => {
      if (newPage < 1) return;
      
      switch (type) {
          case 'movies':
              if (newPage > pagination.movies.totalPages) return;
              setMovieParams(prev => ({ ...prev, page: newPage }));
              break;
          case 'cities':
              if (newPage > pagination.cities.totalPages) return;
              setCityParams(prev => ({ ...prev, page: newPage }));
              break;
          case 'cinemas':
               if (newPage > pagination.cinemas.totalPages) return;
              setCinemaParams(prev => ({ ...prev, page: newPage }));
              break;
          case 'shows':
               if (newPage > pagination.shows.totalPages) return;
              setShowParams(prev => ({ ...prev, page: newPage }));
              break;
          default: break;
      }
  };

  const handleDelete = async (type, id) => {
    // ... (Your existing delete logic is fine)
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
        
        // Refetch the list
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
                fetchCinemas(selectedCityId);
                if (selectedCinemaId === id) setSelectedCinemaId(null);
                break;
            case 'cinema-hall':
                fetchHalls(selectedCinemaId);
                if (selectedHallId === id) setSelectedHallId(null);
                break;
            case 'show':
                fetchShowsAndSeats(selectedHallId);
                break;
        }

    } catch (err) {
        toast.error(`Could not delete: ${err.response?.data?.message || err.message}`);
    }
  };

  // --- Edit & Form Handlers ---
  const handleEditClick = (type, data) => {
      setEditingItem({ type, data });
  };
  
  const handleShowEditClick = (show) => {
    setEditingShow(show);
    setShowAddShowForm(true); // Open the special show form
  };

  const handleShowAddClick = () => {
      setEditingShow(null); // Ensure it's not in edit mode
      setShowAddShowForm(true);
  };

  const handleSave = (type) => {
      // This is called on successful save from a form
      setEditingItem(null);
      setShowAddForm(null);
      
      // Refetch the relevant data
      switch (type) {
          case 'movie': fetchMovies(); break;
          case 'city': fetchCities(); break;
          case 'cinema': fetchCinemas(selectedCityId); break;
          case 'hall': fetchHalls(selectedCinemaId); break;
      }
  };
  
  const handleShowSave = () => {
      setShowAddShowForm(false);
      setEditingShow(null);
      fetchShowsAndSeats(selectedHallId);
  };
  
  const handleCancel = () => {
      setEditingItem(null);
      setShowAddForm(null);
      setShowAddShowForm(false);
      setEditingShow(null);
  };

  const handleToggleShowStatus = async (showId, currentStatus) => {
    // ... (Your existing function is fine)
    const newStatus = !currentStatus;
    try {
      await axiosInstance.put(`/api/admin/shows/${showId}/status`, { isActive: newStatus });
      toast.success(`Show booking status updated to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
      fetchShowsAndSeats(selectedHallId);
    } catch (err) {
      toast.error("Failed to update show status.");
    }
  };

  // --- Selected Objects ---
  const selectedMovie = selectedMovieId ? movies.find(m => m.MovieID === parseInt(selectedMovieId)) : null;
  const selectedCity = selectedCityId ? cities.find(c => c.CityID === parseInt(selectedCityId)) : null;
  const selectedCinema = selectedCinemaId ? cinemas.find(c => c.CinemaID === parseInt(selectedCinemaId)) : null;
  const selectedHall = selectedHallId ? halls.find(h => h.CinemaHallID === parseInt(selectedHallId)) : null;
  
  // --- (8) JSX RENDER (with new UI) ---
  
  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Management</h1>

      {/* --- MODAL FOR EDITING --- */}
      {editingItem && (
          <Modal onClose={handleCancel}>
              {editingItem.type === 'movie' && (
                  <MovieForm onSave={() => handleSave('movie')} onCancel={handleCancel} initialData={editingItem.data} />
              )}
              {editingItem.type === 'city' && (
                  <CityForm onSave={() => handleSave('city')} onCancel={handleCancel} initialData={editingItem.data} />
              )}
              {editingItem.type === 'cinema' && (
                  <CinemaForm onSave={() => handleSave('cinema')} onCancel={handleCancel} initialData={editingItem.data} />
              )}
              {editingItem.type === 'hall' && (
                  <HallForm onSave={() => handleSave('hall')} onCancel={handleCancel} initialData={editingItem.data} />
              )}
          </Modal>
      )}

      {/* --- MOVIE MANAGEMENT SECTION --- */}
      <ManagementSection title="Movie Management">
        {/* NEW Filter Bar */}
        <div style={styles.filterBar}>
            <input 
                type="text" 
                placeholder="Search by Title or ID..."
                value={movieParams.search}
                onChange={e => handleParamChange(setMovieParams, 'search', e.target.value)}
                style={{ flex: 2 }}
            />
            <select value={movieParams.genre} onChange={e => handleParamChange(setMovieParams, 'genre', e.target.value)}>
                <option value="">All Genres</option>
                {[...new Set(allMovies.map(m => m.Genre))].map(g => g && <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={movieParams.language} onChange={e => handleParamChange(setMovieParams, 'language', e.target.value)}>
                <option value="">All Languages</option>
                 {[...new Set(allMovies.map(m => m.Movie_Language))].map(l => l && <option key={l} value={l}>{l}</option>)}
            </select>
            <select value={movieParams.minRating} onChange={e => handleParamChange(setMovieParams, 'minRating', e.target.value)}>
                <option value="">All Ratings</option>
                <option value="9">9.0+</option>
                <option value="8">8.0+</option>
                <option value="7">7.0+</option>
            </select>
            <select value={movieParams.sortKey} onChange={e => handleParamChange(setMovieParams, 'sortKey', e.target.value)}>
                <option value="ReleaseDate">Sort by Release Date</option>
                <option value="Title">Sort by Title</option>
                <option value="Rating">Sort by Rating</option>
            </select>
        </div>

        <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
                {loading.movies && <p>Loading movies...</p>}
                {!loading.movies && movies.map(movie => (
                    <div key={movie.MovieID} onClick={() => setSelectedMovieId(movie.MovieID)} style={{ ...styles.listItem, background: selectedMovieId === movie.MovieID ? '#eef4ff' : 'transparent' }}>
                        <span>{movie.Title} ({movie.Movie_Language})</span>
                        <div>
                            <button onClick={(e) => { e.stopPropagation(); handleEditClick('movie', movie); }} style={styles.editButton}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('movie', movie.MovieID); }} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
                
                <Pagination 
                    currentPage={pagination.movies.currentPage}
                    totalPages={pagination.movies.totalPages}
                    onPageChange={(page) => handlePageChange('movies', page)}
                />
                
                {!showAddForm && <button onClick={() => setShowAddForm('movie')} style={{marginTop: '10px'}}>+ Add New Movie</button>}
                {showAddForm === 'movie' && (
                    <MovieForm onSave={() => handleSave('movie')} onCancel={handleCancel} />
                )}
            </div>
            <div style={{flex: 1}}>
                {selectedMovie ? <MovieDetails movie={selectedMovie} /> : <p>Select a movie to see details.</p>}
            </div>
        </div>
      </ManagementSection>

      {/* --- THEATER MANAGEMENT SECTIONS --- */}
      <ManagementSection title="Theater Management: Cities">
        {/* NEW Filter Bar */}
        <div style={styles.filterBar}>
             <input 
                type="text" 
                placeholder="Search by Name, Zip, or ID..."
                value={cityParams.search}
                onChange={e => handleParamChange(setCityParams, 'search', e.target.value)}
                style={{ flex: 1 }}
            />
        </div>
        
        <div style={{display: 'flex', gap: '20px'}}>
            <div style={{flex: 1}}>
                {loading.cities && <p>Loading cities...</p>}
                {!loading.cities && cities.map(city => (
                    <div key={city.CityID} onClick={() => setSelectedCityId(city.CityID)} style={{ ...styles.listItem, background: selectedCityId === city.CityID ? '#eef4ff' : 'transparent' }}>
                        <span>{city.City_Name}, {city.City_State}</span>
                        <div>
                             <button onClick={(e) => { e.stopPropagation(); handleEditClick('city', city); }} style={styles.editButton}>Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); handleDelete('city', city.CityID); }} style={styles.deleteButton}>Delete</button>
                        </div>
                    </div>
                ))}
                
                 <Pagination 
                    currentPage={pagination.cities.currentPage}
                    totalPages={pagination.cities.totalPages}
                    onPageChange={(page) => handlePageChange('cities', page)}
                />

                {!showAddForm && <button onClick={() => setShowAddForm('city')} style={{marginTop: '10px'}}>+ Add City</button>}
                {showAddForm === 'city' && <CityForm onSave={() => handleSave('city')} onCancel={handleCancel} />}
            </div>
            {selectedCity && <div style={{flex: 1}}><CityDetails city={selectedCity} /></div>}
        </div>
      </ManagementSection>

      {/* --- CINEMA SECTION --- */}
      {selectedCityId && (
        <ManagementSection title={`Cinemas in ${selectedCity?.City_Name}`}>
            {/* NEW Filter Bar */}
            <div style={styles.filterBar}>
                <input 
                    type="text" 
                    placeholder="Search by Name or ID..."
                    value={cinemaParams.search}
                    onChange={e => handleParamChange(setCinemaParams, 'search', e.target.value)}
                    style={{ flex: 1 }}
                />
                 <input 
                    type="text" 
                    placeholder="Filter by facility..."
                    value={cinemaParams.facilities}
                    onChange={e => handleParamChange(setCinemaParams, 'facilities', e.target.value)}
                    style={{ flex: 1 }}
                />
                <select value={cinemaParams.cancellation} onChange={e => handleParamChange(setCinemaParams, 'cancellation', e.target.value)}>
                    <option value="">Cancellation (All)</option>
                    <option value="true">Allowed</option>
                    <option value="false">Not Allowed</option>
                </select>
            </div>

            { loading.cinemas && <p>Loading cinemas...</p> }
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {!loading.cinemas && cinemas.map(cinema => (
                        <div key={cinema.CinemaID} onClick={() => setSelectedCinemaId(cinema.CinemaID)} style={{ ...styles.listItem, background: selectedCinemaId === cinema.CinemaID ? '#eef4ff' : 'transparent' }}>
                            <span>{cinema.Cinema_Name}</span>
                            <div>
                                <button onClick={(e) => { e.stopPropagation(); handleEditClick('cinema', cinema); }} style={styles.editButton}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema', cinema.CinemaID); }} style={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                    
                    <Pagination 
                        currentPage={pagination.cinemas.currentPage}
                        totalPages={pagination.cinemas.totalPages}
                        onPageChange={(page) => handlePageChange('cinemas', page)}
                    />
                    
                    {!showAddForm && <button onClick={() => setShowAddForm('cinema')} style={{marginTop: '10px'}}>+ Add Cinema</button>}
                    {showAddForm === 'cinema' && <CinemaForm cityId={selectedCityId} onSave={() => handleSave('cinema')} onCancel={handleCancel} />}
                </div>
                {selectedCinema && <div style={{flex: 1}}><CinemaDetails cinema={selectedCinema} /></div>}
            </div>
        </ManagementSection>
      )}

      {/* --- HALL SECTION --- */}
      {selectedCinemaId && (
        <ManagementSection title={`Halls in ${selectedCinema?.Cinema_Name}`}>
            { loading.halls && <p>Loading halls...</p> }
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{flex: 1}}>
                    {!loading.halls && halls.map(hall => (
                        <div key={hall.CinemaHallID} onClick={() => setSelectedHallId(hall.CinemaHallID)} style={{ ...styles.listItem, background: selectedHallId === hall.CinemaHallID ? '#eef4ff' : 'transparent' }}>
                            <span>{hall.Hall_Name}</span>
                            <div>
                                <button onClick={(e) => { e.stopPropagation(); handleEditClick('hall', hall); }} style={styles.editButton}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete('cinema-hall', hall.CinemaHallID); }} style={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    ))}
                    
                    {!showAddForm && <button onClick={() => setShowAddForm('hall')} style={{marginTop: '10px'}}>+ Add Hall</button>}
                    {showAddForm === 'hall' && <HallForm cinemaId={selectedCinemaId} onSave={() => handleSave('hall')} onCancel={handleCancel} />}
                </div>
                {selectedHall && <div style={{flex: 1}}><HallDetails hall={selectedHall} allSeats={seats} /></div>}
            </div>
        </ManagementSection>
      )}

      {/* --- SHOW SECTION --- */}
      {selectedHallId && (
        <ManagementSection title={`Shows in ${selectedHall?.Hall_Name}`}>
            {/* NEW Filter Bar */}
             <div style={styles.filterBar}>
                <select value={showParams.movieId} onChange={e => handleParamChange(setShowParams, 'movieId', e.target.value)}>
                    <option value="">All Movies</option>
                    {allMovies.map(m => <option key={m.MovieID} value={m.MovieID}>{m.Title}</option>)}
                </select>
                 <input 
                    type="date" 
                    value={showParams.date}
                    onChange={e => handleParamChange(setShowParams, 'date', e.target.value)}
                />
                <input 
                    type="text"
                    placeholder="Language..."
                    value={showParams.language}
                    onChange={e => handleParamChange(setShowParams, 'language', e.target.value)}
                />
                <select value={showParams.status} onChange={e => handleParamChange(setShowParams, 'status', e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            { loading.shows && <p>Loading shows...</p> }
            {shows.length > 0 ? (
                    <table style={{ width: "100%", borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                        <thead>
                            <tr style={{ background: '#f4f4f4' }}>
                                <th style={styles.th}>Movie</th>
                                <th style={styles.th}>Date & Time</th>
                                <th style={styles.th}>Format</th>
                                <th style={styles.th}>Language</th>
                                <th style={styles.th}>Seat Prices</th>
                                <th style={styles.th}>Start Booking</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shows.map(s => (
                            <tr key={s.ShowID}>
                                <td style={styles.td}>{s.Title}</td>
                                <td style={styles.td}>
                                    {new Date(s.Show_Date).toLocaleDateString()} at {new Date(s.StartTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </td>
                                <td style={styles.td}>{s.Format}</td>
                                <td style={styles.td}>{s.Show_Language}</td>
                                <td style={styles.td}>
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
                                <td style={styles.td}>
                                    <label style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        cursor: s.Format === 'EXPIRED' ? 'not-allowed' : 'pointer',
                                        opacity: s.Format === 'EXPIRED' ? 0.6 : 1
                                    }}>
                                        <input 
                                            type="checkbox"
                                            checked={Boolean(s.isActive)} 
                                            onChange={() => handleToggleShowStatus(s.ShowID, s.isActive)}
                                            style={{ height: '18px', width: '18px' }}
                                            disabled={s.Format === 'EXPIRED'}
                                        />
                                        <span style={{ marginLeft: '8px' }}>
                                            {/* Show "Expired" if the format is set */}
                                            {s.Format === 'EXPIRED' ? 'Expired' : (s.isActive ? 'Active' : 'Inactive')}
                                        </span>
                                    </label>
                                </td>
                                <td style={styles.td}>
                                    <div style={{display: 'flex', gap: '5px'}}>
                                        <button onClick={() => handleShowEditClick(s)} style={styles.editButton}>Edit</button>
                                        <button onClick={() => handleDelete('show', s.ShowID)} style={styles.deleteButton}>Delete</button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
            ): !loading.shows && <p>No shows scheduled for this hall matching your filters.</p>}
            
            <Pagination 
                currentPage={pagination.shows.currentPage}
                totalPages={pagination.shows.totalPages}
                onPageChange={(page) => handlePageChange('shows', page)}
            />

            {!showAddShowForm ? (
                <button onClick={handleShowAddClick} style={{marginTop: '10px'}}>+ Add Show</button>
            ) : (
                <AddShowForm 
                    hall={selectedHall} 
                    movies={allMovies} /* Give it the full list */
                    allSeats={seats}
                    initialData={editingShow}
                    onShowAdded={handleShowSave}
                    onCancel={handleCancel}
                />
            )}
        </ManagementSection>
      )}
    </div>
  );
}


// --- (9) STYLES ---
// (Added some simple styles for readability)
const styles = {
    filterBar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px',
        paddingBottom: '16px',
        borderBottom: '1px solid #eee'
    },
    listItem: {
        padding: '10px', 
        cursor: 'pointer', 
        border: '1px solid #ddd', 
        marginBottom:'5px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    editButton: {
        background: '#007bff',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginRight: '5px'
    },
    deleteButton: {
        background: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    th: {
        padding: '8px', 
        border: '1px solid #ddd', 
        textAlign: 'left',
        fontSize: '14px'
    },
    td: {
        padding: '8px', 
        border: '1px solid #ddd',
        fontSize: '14px',
        verticalAlign: 'top',
        wordBreak: 'break-word'
    },
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
    },
    modalContent: {
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '600px',
        position: 'relative'
    },
    modalCloseButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer'
    }
};