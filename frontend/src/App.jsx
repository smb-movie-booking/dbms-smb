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
import SeatSelect from './pages/SeatSelect/SeatSelect';
import AdminLayout from './pages/Admin/AdminLayout';
import UserManagement from './pages/Admin/UserManagement/UserManagement';
import BookingManagement from './pages/Admin/BookingManagement/BookingManagement';
import AnalyticsDashboard from './pages/Admin/AnalyticsDashboard/AnalyticsDashboard';

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
      

      <Routes>
        {/* --- THE FIX IS ON THIS LINE --- */}
        {/* Changed selected_City to selectedCity */}
        <Route path='/' element={<><Navbar selectedCity={selectedCity} onCityChange={handleCityChange} /><Home selectedCity={selectedCity}/></>} />
        
        <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
        <Route path='/register' element={!authUser ? <Register /> : <Navigate to="/" />} />
        <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to="/" />} />
        <Route path='/:userid/edit' element={authUser ? <><Navbar selectedCity={selectedCity} onCityChange={handleCityChange} /> <EditProfile /></> : <Login />} />
        
        {/* Pass selectedCity down to build the correct link for 'Book Tickets' */}
        <Route path='/movies/:movieId' element={<><Navbar selectedCity={selectedCity} onCityChange={handleCityChange} /> <MovieDetails selectedCity={selectedCity}/>   </>} />
        
        {/* Your flexible showtimes routes are now included */}
        <Route path='/movie/:movieId/theaters' element={<><Navbar selectedCity={selectedCity} onCityChange={handleCityChange} /> <ShowtimesPage /> </>} />
        <Route path='/theater/:theaterId/movies'  element={<><Navbar selectedCity={selectedCity} onCityChange={handleCityChange} /> <ShowtimesPage /> </>} />
        <Route path='/seat/show/:showid' element={<SeatSelect/>}/>

        <Route 
          path="/admin" 
          element={
            <ProtectedAdmin>
              <AdminLayout />
            </ProtectedAdmin>
          } 
        >
          {/* These routes will render INSIDE AdminLayout */}
          <Route index element={<AdminManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="bookings" element={<BookingManagement />} />
          <Route path="analytics" element={<AnalyticsDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

