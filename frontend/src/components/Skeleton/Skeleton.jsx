import React, { useEffect } from 'react'
import './skeleton.css'
const Skeleton = () => {
    useEffect(()=>{
        document.body.style.overflow="hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    },[])
  return (
    <div className='skeleton-container' style={{padding:"0 1rem 0.5rem 1rem",height:"100vh",display:"flex",flexDirection:"column", gap:"1rem"}} >
      <div className='skeleton-animation' style={{width:"100%",height:"50px"}}/>
      <div className='skeleton-animation' style={{width:"100%",height:"250px"}}/>

      <div className="skeleton-gridContainer">
        <div className='skeleton-animation'/>
        <div className='skeleton-animation'/>
        <div className='skeleton-animation'/>
        <div className='skeleton-animation'/>
      </div>
    </div>
  )
}

export default Skeleton
