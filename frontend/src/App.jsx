import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from './hooks/auth/useAuth';
import { Auth } from './Context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import EditProfile from './pages/EditProfile/EditProfile';
import ProtectedAdmin from './components/ProtectedAdmin';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import ShowtimesPage from './pages/Showtimes/ShowtimesPage';
import AdminManagement from './pages/Admin/AdminManagement/AdminManagement';

function App() {
  const { getUser } = useAuth();
  const { authUser } = useContext(Auth);
  const navigate = useNavigate(); // Hook for programmatic navigation

  // We use local state for the city, initialized with a default value.
  const [selectedCity, setSelectedCity] = useState({ id: 10, name: "Kochi" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
      setLoading(false);
    };
    fetchUser();
  }, []);

  // Handler for when a new city is selected from the Navbar
  const handleCityChange = (city) => {
    setSelectedCity(city);
    // Navigate to the home page to reflect the new city selection
    navigate('/');
  };

  if (loading) return <p>Loading application...</p>;

  return (
    <>
      <Toaster />
      {/* Pass the stable selectedCity state and the new handler to the Navbar */}
      <Navbar selectedCity={selectedCity} onCityChange={handleCityChange} />

      <Routes>
        {/* --- THE FIX IS ON THIS LINE --- */}
        {/* Changed selected_City to selectedCity */}
        <Route path='/' element={<Home selectedCity={selectedCity} />} />
        
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/register' element={!authUser ? <Register /> : <Navigate to="/" />} />
        <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to="/" />} />
        <Route path='/:userid/edit' element={authUser ? <EditProfile /> : <Login />} />
        
        {/* Pass selectedCity down to build the correct link for 'Book Tickets' */}
        <Route path='/movies/:movieId' element={<MovieDetails selectedCity={selectedCity} />} />
        
        {/* Your flexible showtimes routes are now included */}
        <Route path='/movie/:movieId/theaters' element={<ShowtimesPage />} />
        <Route path='/theater/:theaterId/movies' element={<ShowtimesPage />} />

        <Route 
          path="/admin" 
          element={
            <ProtectedAdmin>
              <AdminManagement />
            </ProtectedAdmin>
          } 
        />
      </Routes>
    </>
  );
}

export default App;

