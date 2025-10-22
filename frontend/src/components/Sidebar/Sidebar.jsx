import React, { useContext } from 'react'
import './sidebar.css'
import { Auth } from '../../Context/AuthContext'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/auth/useAuth';

const Sidebar = ({isOpen,setIsOpen}) => {
  const {authUser}=useContext(Auth);
  const {logoutUser}=useAuth();
  const navigate=useNavigate();

  const handleClick=async()=>{
    setIsOpen(false);
    await logoutUser();

  }
  return (
    <div className={`sidebar-container ${isOpen?"show":""}`}>
      <div className='top-section'>
        <h2>Hey <span>{authUser?.user.name}</span></h2>
      </div>

      <div className='middle-section' style={{display:`${authUser?"none":"flex"}`}}>
        <p>SignIn To Book Tickes for<br/> your <span className='fav'>Favorite Movies</span></p>
        <button onClick={()=>navigate("/login")}>Login</button>


      </div>

      <div className='bottom-section'>
        <div>
          {authUser?.user&&<button onClick={()=>{navigate(`/${authUser.user.id}/edit`);setIsOpen(false)}} className='app-btn'>Edit Profile</button>}
          {authUser?.user&&<button className='app-btn' onClick={()=>navigate(`/${authUser?.user?.id}/orders`,{replace:true})}>Your Orders</button>}
          {authUser?.user&& authUser.user.isAdmin && (<button className="app-btn" onClick={() => { navigate("/admin"); setIsOpen(false); }}> Admin</button>)}
        </div>

        {authUser?.user&&  <button onClick={handleClick} className='signout-btn'>SignOut</button>}

      </div>
    </div>
  )
}

export default Sidebar
