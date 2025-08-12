import React, { useState } from 'react'
import OtpField from '../../components/OtpField/OtpField'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth';
import './login.css'
import '../Register/register.css'
import { Eye, EyeOff } from 'lucide-react';
import ResetPassword from '../ResetPassword/ResetPassword';
import { useAuthError } from '../../hooks/auth/useAuthError';
import toast from 'react-hot-toast';

const Login = () => {
 
  const [formData,setFormData]=useState({password:"",phone:""})
  const [showPassword,setShowPassword]=useState(false);
  const {login,getUser}=useAuth();
  const navigate=useNavigate();
  

  const {validateData,errors,setErrors}=useAuthError();

  const reqOtp=async(e)=>{
    e.preventDefault();
    console.log(formData)
    const {phone,email,password}=formData;
    if(phone && email){
      return toast.error("Fill in any one field");
    }
    const valid=validateData(formData);
    console.log(valid)
    if(valid){
      console.log(formData);
      setErrors({});
      const isLoggedIn=await login({identifier:formData.phone || formData.email,password:formData.password});
      if(isLoggedIn){
        navigate("/");
      }
    }
    else{
      return;
    }
    



  }

  //console.log(formData);
  return (
    <form onSubmit={reqOtp}>
    <div className='register-container' style={{marginInline:"auto" ,display:"flex",justifyContent:"center",paddingTop:"20px",marginTop:"2rem"}}>
      <div style={{width:"100%"}} >
        <p className='header'>Login</p>
        
        <div style={{padding:"8px 20px"}}>

          <div style={{display:"flex",alignItems:"center",marginBottom:"12px"}}>
            <p>+91</p>

            <div>
              <input type='text'
              value={formData.phone}
              onChange={(e)=>setFormData({...formData,phone:e.target.value})}
              placeholder='mobile number'
              className='mobile-field'/>
      
            </div>
            
          </div>
          {errors.mobile&&<p className='error'>{errors.mobile}</p>}

          <div style={{width:"100%",display:"flex",alignItems:"center",color:"var(--secondary-color)",fontSize:"large"}}>
            <hr style={{width:"100%",height:"1px",borderColor:"gray",opacity:"0.3"}}/> or 
            <hr style={{width:"100%",height:"1px",borderColor:"gray",opacity:"0.3"}}/>
          </div>

          <div className='register-field' style={{marginBottom:"2rem"}} >
                <label>Email </label>
                <input
                name='email'
                type='text'
                onChange={(e)=>setFormData({...formData,email:e.target.value})}
                value={formData?.email || ""}
                
                placeholder='Email'/>
                {errors.email&&<div className='error'>{errors.email}</div>}

          </div>
         

          <div className='register-field'>
            <label className='field-name'>Password</label>
            <div style={{position:"relative"}}>
              <input className=''
              value={formData.password}
              onChange={(e)=>setFormData({...formData,password:e.target.value})}
              type={`${showPassword?"text":"password"}`}
              placeholder='password'/>
              {errors.password && <p className='error'>{errors.password}</p>}

              <span onClick={()=>setShowPassword(!showPassword)} style={{position:"absolute",right:"0",top:"20%"}}>{showPassword?<Eye/>:<EyeOff/>}</span>
            </div>
          </div>


          <div>
            <button className='otp-btn' >LogIn</button>
            <Link to="/reset-password ">
            <p className='forgot-pass'>Forgot Password ?</p>
            </Link>
            
          </div>
        </div>
        

        <span>Don't Have an Account?
          <Link to="/register">Register</Link>
        </span>
        
      </div>
      
    </div>
    </form>
  
  )
}

export default Login
