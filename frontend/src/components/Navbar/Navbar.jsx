import React, { useContext, useEffect, useState } from 'react'
import './nav.css'
import {Menu, Search} from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../Context/AuthContext';
const Navbar = () => {
    const [isOpen,setIsOpen]=useState(false);
    const navigate=useNavigate();
    const {authUser,setAuthUser}=useContext(Auth);

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
        <div className='logoImg'>
            <img src='' alt='Logo'/>
        </div>

        <div className='search-container'>
            <Search stroke='gray'/>
            <input
            type='text'
            placeholder='Search for your favorite movies'
            className='search-input'/>
        </div>

        <div className='menu-cont'>
            <span>
                <p>Kochi</p>
            </span>

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
