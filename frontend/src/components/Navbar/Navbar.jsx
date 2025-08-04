import React, { useState } from 'react'
import './nav.css'
import {Menu, Search} from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const [isOpen,setIsOpen]=useState(false);
    const navigate=useNavigate();
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

            <button onClick={()=>navigate("/register")}>Register</button>

            <div onClick={()=>setIsOpen(true)}>
                <Menu />
            </div>
        </div>
        
    </nav>
    <Sidebar isOpen={isOpen}/>
    </>
  )
}

export default Navbar
