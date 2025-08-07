import {Routes,Route, Navigate} from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Navbar from './components/Navbar/Navbar'
import { useContext, useEffect, useState } from 'react'
import { useAuth } from './hooks/auth/useAuth'
import { Auth } from './Context/AuthContext'
import toast, { Toaster } from 'react-hot-toast';
import ResetPassword from './pages/ResetPassword/ResetPassword'

function App() {
  const {getUser}=useAuth();
  const {authUser}=useContext(Auth);

  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    const fetchUser=async()=>{
        await getUser();
        setLoading(false);
        
    }
    fetchUser();
    
  },[])

  if(loading){
    return <div>Loading...</div>
  }
  console.log(authUser)
  return (
    <>
    <Toaster/>
      
      <Routes>
        <Route path='/' element={<><Navbar/> <Home/></>}/>
        <Route path='/login' element={!authUser?<Login/>:<Navigate to="/"/>}/>
        <Route path='/register' element={!authUser?<Register/>:<Navigate to="/"/>}/>
        <Route path='/reset-password' element={!authUser?<ResetPassword/>:<Navigate to="/"/>}/>
      </Routes>
    </>
  )
}

export default App
