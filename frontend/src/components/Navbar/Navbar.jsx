import React, { useContext, useEffect, useRef, useState } from 'react'
import './nav.css'
import {Clapperboard, Menu, School, Search} from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../Context/AuthContext';
import { axiosInstance } from '../../utils/axios';
import { useDebounce } from '../../hooks/auth/useDebounce';
import toast from 'react-hot-toast';

const Navbar = ({ selectedCity, onCityChange }) => {
    const searchRef=useRef(null);
    const [isOpen,setIsOpen]=useState(false);
    const navigate=useNavigate();
    const {authUser,setAuthUser}=useContext(Auth);
    const [cities, setCities] = useState([]);
    const [searchText,setSearchText]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [showsuggestion,setShowSuggestion]=useState(false);
    const debouncedValue=useDebounce(searchText);

    useEffect(()=>{

        const handleMouseDown=(e)=>{
            console.log(searchRef.current);
            if(searchRef.current && !searchRef.current.contains(e.target)){
                setShowSuggestion(false);
            }
        }
        document.addEventListener("mousedown",handleMouseDown);

        return ()=>document.removeEventListener("mousedown",handleMouseDown)
    },[])

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

    const getMovies=async()=>{
         try {
            if(debouncedValue.length === 0){
                setShowSuggestion(false);
                return
            }
            setShowSuggestion(true)
            const {data}=await axiosInstance.get("/movies/search",{
                params:{
                    searchString:debouncedValue
                }
            })
            setSearchResult(data.movies);
            console.log(data.movies);
        } catch (error) {
            toast.error(error.response.data.message || error.message);
            
        }finally{

        }

    }

    useEffect(()=>{
       getMovies();
    },[debouncedValue])

    const handleClick=(result)=>{
        if(result.MovieID){
            navigate(`movies/${result.MovieID}`);
        }else{
            navigate(`/`); //edit here theatre
        }

        setShowSuggestion(false);

    }
   
  return (
    <>
    {isOpen  &&<div className='backdrop' onClick={()=>{setIsOpen(false)}} />}
    <nav>
        <div
          className="logoImg"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <img
            src="/logo-smb.png" // 1. Use the new image name
            alt="Logo"
            // 2. Updated styles for a rectangular logo
            style={{ height: "60px", width: "auto", objectFit: "contain" }}
          />
        </div>

        <div className='search-container' ref={searchRef}>
            <Search stroke='gray'/>
            <input
            type='text'
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
            placeholder='Search for your favorite movies'
            className='search-input'/>

            {(searchText.length >0 && showsuggestion) && <div className='search-suggestions-container'>
                    {searchResult.length >0 ? searchResult.map((result,index)=>{
                        return <div onClick={()=>handleClick(result)} className="suggestions" key={result.MovieID || result?.CinemaID}>
                            { result.MovieID ? 
                            <div style={{display:'flex',justifyContent:"space-between"}}>
                                <span>{result?.Title}</span><span><Clapperboard/></span>
                            </div> :

                            <div style={{display:'flex',justifyContent:"space-between"}}>
                                <span>{result?.Cinema_Name}</span>
                                <span><School/></span>
                            </div>
                            }
                            
                            </div>
                    }):"No Result"}
            </div>}
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
