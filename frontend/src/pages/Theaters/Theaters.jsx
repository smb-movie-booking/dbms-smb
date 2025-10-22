import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import DateSelector from '../../components/DateSelector/DateSelector';
import ShowListGroup from '../../components/ShowListGroup/ShowListGroup';
import './Theaters.css';
import TheaterShowtimes from './TheaterListPage';

export function Theaters() {
  const { theaterId } = useParams();

  const [theaterDetails, setTheaterDetails] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Fetch movies available in a given theater
  useEffect(() => {
    if (!theaterId) return;

    const fetchTheaterMovies = async () => {
      setLoading(true);
      let formattedDate = selectedDate.toLocaleDateString('en-CA');

      try {
        const movieRes = await axiosInstance.get(`/api/movies/explore`, {
          params: {
            theater: theaterId,
            showDate: formattedDate,
          },
        });

        setMovies(movieRes.data);
      } catch (err) {
        console.error('Error fetching theater or movies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterMovies();
  }, [theaterId,selectedDate, selectedFormat, selectedLanguage, selectedTime]);

  return (
    <TheaterShowtimes movies={movies} selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
  );
}

export default Theaters;
