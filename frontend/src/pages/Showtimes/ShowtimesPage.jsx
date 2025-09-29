import { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';

// Import Child Components
import DateSelector from '../../components/DateSelector/DateSelector';
import ShowListGroup from '../../components/ShowListGroup/ShowListGroup';
import TheaterDetailsModal from '../../components/TheaterDetailsModal/TheaterDetailsModal';
import './ShowtimesPage.css';

// A small, local component for the time filter buttons
const TimeFilter = ({ selected, onSelect }) => {
  const times = [
    { key: 'morning', label: 'Morning' },
    { key: 'afternoon', label: 'Afternoon' },
    { key: 'evening', label: 'Evening' },
    { key: 'night', label: 'Night' },
  ];
  return (
    <div className="time-filter-buttons">
      {times.map(time => (
        <button
          key={time.key}
          className={selected === time.key ? 'active' : ''}
          onClick={() => onSelect(selected === time.key ? '' : time.key)}
        >
          {time.label}
        </button>
      ))}
    </div>
  );
};

const ShowtimesPage = () => {
  const { movieId , theaterId} = useParams();
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('city');

  const [movieDetails, setMovieDetails] = useState(null);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [modalTheater, setModalTheater] = useState(null);

  useEffect(() => {
     if (movieId) {
      const fetchAllData = async () => {
        if (!movieId || !cityId) return;
        setLoading(true);
        const formattedDate = selectedDate.toISOString().split('T')[0];

        try {
          if (!movieDetails) {
              const movieRes = await axiosInstance.get(`/movies/explore?movie=${movieId}`);
              setMovieDetails(movieRes.data);
          }

          const showsRes = await axiosInstance.get('/theaters/lookup', {
            params: {
              movie: movieId, showDate: formattedDate, city: cityId,
              format: selectedFormat || undefined, language: selectedLanguage || undefined,
              preferredTime: selectedTime || undefined
            }
          });
          setTheaters(showsRes.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAllData();
    } 
    // 3. Add a placeholder 'else if' block for your teammate.
    else if (theaterId) {
      // --- FOR YOUR TEAMMATE ---
      // TODO: Implement the data fetching for the "theater-first" view here.
      // You have access to `theaterId`, `cityId`, and all the filters.
      console.log("TEAMMATE: Implement fetch for theater ID:", theaterId);
      
      // For now, just stop the loading spinner and clear data.
      setLoading(false);
      setTheaters([]); // Ensure list is empty
    }
  }, [movieId, theaterId , cityId, selectedDate, selectedFormat, selectedLanguage, selectedTime]);

  // Style object for the background image
  const headerStyle = movieDetails ? {
    backgroundImage: `url(${movieDetails.Poster_Image_URL})`
  } : {};

  return (
    <div className="showtimes-page">
      {movieId && (
        <>
      {/* 1. Updated Movie Details Header */}
      {movieDetails && (
        <div className="movie-header-bar" style={headerStyle}>
          <div className="header-overlay">
            <Link to={`/movies/${movieId}`} className="movie-title-link">
              <h1>{movieDetails.Title}</h1>
            </Link>
            <div className="movie-tags">
              <span>🕒 {movieDetails.Duration}</span>
              <span>{movieDetails.Age_Format}</span>
              <span>{movieDetails.Genre}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Filter Bar */}
      <div className="filter-bar">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <select className="filter-select" value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
          <option value="">All Languages</option>
          <option value="Malayalam">Malayalam</option>
          <option value="Tamil">Tamil</option>
          <option value="Hindi">Hindi</option>
          <option value="English">English</option>
        </select>
        <select className="filter-select" value={selectedFormat} onChange={e => setSelectedFormat(e.target.value)}>
          <option value="">All Formats</option>
          <option value="2D">2D</option>
          <option value="3D">3D</option>
          <option value="DOLBY 7.1">DOLBY 7.1</option>
        </select>
      </div>

      {/* 3. Preferred Time Filter */}
      <TimeFilter selected={selectedTime} onSelect={setSelectedTime} />

      {/* 4. Theaters & Shows List */}
      <div className="theaters-list">
        {loading ? <p>Finding available shows...</p> : (
          theaters.length > 0 ? (
            theaters.map((theater) => (
              <ShowListGroup
                key={theater.CinemaID}
                title={theater.cinemaName}
                shows={theater.shows || []}
                onTitleClick={() => setModalTheater(theater)} // This opens the modal
              />
            ))
          ) : (
            <div className="no-shows-found">
              <h3>Unable to find what you are looking for?</h3>
              <p>Try changing your filters or the selected date.</p>
            </div>
          )
        )}
      </div>

      {/* 5. Theater Details Modal (Popup) */}
      <TheaterDetailsModal 
        theater={modalTheater} 
        onClose={() => setModalTheater(null)} 
      />
    </>
      )}

       {theaterId && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>Showtimes for Theater (ID: {theaterId})</h1>
          <p style={{ color: 'orange' }}>
            <strong>Note to Developer:</strong> This section is a placeholder. 
            Please implement the UI for the theater-first view here.
          </p>
        </div>
      )}

    </div>
  );
};

export default ShowtimesPage;

