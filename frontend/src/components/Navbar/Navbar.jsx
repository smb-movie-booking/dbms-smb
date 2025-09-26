import React, { useContext, useEffect, useState } from 'react'
import './nav.css'
import {Menu, Search} from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../Context/AuthContext';
import { axiosInstance } from '../../utils/axios';

const Navbar = ({ selectedCity, onCityChange }) => {
    const [isOpen,setIsOpen]=useState(false);
    const navigate=useNavigate();
    const {authUser,setAuthUser}=useContext(Auth);
    const [cities, setCities] = useState([]);

    useEffect(() => {
  const fetchCities = async () => {
    try {
      const { data } = await axiosInstance.get("/movies/cities");
      setCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  fetchCities();
}, []);

    useEffect(()=>{
        if(isOpen){
            document.body.style.overflow="hidden";
        }
        else{
            document.body.style.overflow="auto";
        }
    },[isOpen])
  return (
    <>
    {isOpen&&<div className='backdrop' onClick={()=>setIsOpen(false)} />}
    <nav>
        <div
        className="logoImg"
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
        >
        <img
            src="/M.png"
            alt="Logo"
            style={{ width: "50px", height: "auto", objectFit: "contain" }}
            />

        </div>

        <div className='search-container'>
            <Search stroke='gray'/>
            <input
            type='text'
            placeholder='Search for your favorite movies'
            className='search-input'/>
        </div>

        <div className='menu-cont'>
            <select
        className="city-dropdown"
        value={selectedCity.name} // use prop from App
        onChange={(e) => {
            const selected = cities.find(city => city.name === e.target.value);
            if (!selected) return;
            if (onCityChange) onCityChange(selected); // send full object to App
        }}
    >
        {cities.map((city) => (
            <option key={city.id} value={city.name}>
                {city.name}
            </option>
        ))}
    </select>


            {!authUser?<button onClick={()=>navigate("/register")} className='register-btn'>Register</button>:
            <button className='profile-btn' onClick={()=>navigate(`/${authUser?.user?.id}/edit`)}>{authUser?.user.name.slice(0,1).toUpperCase()}</button>}

            <div onClick={()=>setIsOpen(true)}>
                <Menu />
            </div>
        </div>
        
    </nav>
    <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
    </>
  )
}

export default Navbar
