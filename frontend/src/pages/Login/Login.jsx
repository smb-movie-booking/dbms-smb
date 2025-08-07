import React, { useState } from 'react'
import OtpField from '../../components/OtpField/OtpField'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth';
import './login.css'
import '../Register/register.css'
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
 
  const [formData,setFormData]=useState({password:"",phone:""})
  const [otp,setOtp]=useState(new Array(6).fill(""))
  const [errors,setErrors]=useState({});
  const [OtpForm,setOtpForm]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const {login,getUser}=useAuth();

  const reqOtp=async()=>{
    console.log(formData)
    const {phone,password}=formData;
    let error={};
    const regex = /^[6-9]\d{9}$/;
    if(!regex.test(phone)){
      error.mobile="Enter valid mobile number"
      
    }

    if(!password || password.length<6){
      error.password="password is req and should be atleast 6 char long"
    }

    if(Object.keys(error).length){
      setErrors(error);
      return
    }
    setErrors("");

    await login({identifier:formData.phone,password:formData.password})


  }
  return (
    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",paddingTop:"20px"}}>
      <div className='register-container'>
        <p className='header'>LogIn</p>

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


          
          <button className='otp-btn' onClick={reqOtp}>LogIn</button>
        </div>

        <span>Don't Have an Account?
          <Link to="/register">Register</Link>
        </span>
        
      </div>
      
    </div>
  
  )
}

export default Login
