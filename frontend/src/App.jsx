import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Navbar from './components/Navbar/Navbar';
import { useContext, useEffect, useState } from 'react';
import { useAuth } from './hooks/auth/useAuth';
import { Auth } from './Context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import EditProfile from './pages/EditProfile/EditProfile';
import ProtectedAdmin from './components/ProtectedAdmin';
import { adminRoutes } from "./routes/adminRoutes";
import MovieDetails from './pages/MovieDetails/MovieDetails';
import Skeleton from './components/Skeleton/Skeleton';

function App() {
  const { getUser } = useAuth();
  const { authUser } = useContext(Auth);

  const [selectedCity, setSelectedCity] = useState({ id: 10, name: "Kochi" }); // For city selection
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      await getUser();
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) return <Skeleton />;

  return (
    <>
      <Toaster />
      {/* Render Navbar once at the top */}
      <Navbar selectedCity={selectedCity} onCityChange={setSelectedCity} />

      <Routes>
  <Route path='/' element={<Home selectedCity={selectedCity} />} />
  <Route path='/login' element={!authUser ? <Login /> : <Navigate to="/" />} />
  <Route path='/register' element={!authUser ? <Register /> : <Navigate to="/" />} />
  <Route path='/reset-password' element={!authUser ? <ResetPassword /> : <Navigate to="/" />} />
  <Route path='/:userid/edit' element={authUser ? <EditProfile /> : <Login />} />
  <Route path='/movies/:movieId' element={<MovieDetails />} />
  {adminRoutes.map(({ path, element }, index) => (
    <Route key={index} path={path} element={<ProtectedAdmin>{element}</ProtectedAdmin>} />
  ))}
</Routes>

    </>
  );
}

export default App;
