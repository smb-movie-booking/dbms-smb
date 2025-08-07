import React, { useState } from 'react'
import OtpField from '../../components/OtpField/OtpField'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth';
import './login.css'
import '../Register/register.css'
import { Eye, EyeOff } from 'lucide-react';
import ResetPassword from '../ResetPassword/ResetPassword';
import { useAuthError } from '../../hooks/auth/useAuthError';

const Login = () => {
 
  const [formData,setFormData]=useState({password:"",phone:""})
  const [otp,setOtp]=useState(new Array(6).fill(""))
  //const [errors,setErrors]=useState({});
  const [OtpForm,setOtpForm]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const {login,getUser}=useAuth();
  

  const {validateData,errors,setErrors}=useAuthError();

  const reqOtp=async()=>{
    console.log(formData)
    const {phone,password}=formData;
    const valid=validateData(formData);
    console.log(valid)
    if(valid){
      setErrors({});
      await login({identifier:formData.phone,password:formData.password})
    }
    else{
      return;
    }
    



  }
  return (
    <div className='register-container' style={{marginInline:"auto" ,display:"flex",justifyContent:"center",paddingTop:"20px"}}>
      <div style={{width:"100%"}} >
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


          <div>
            <button className='otp-btn' onClick={reqOtp}>LogIn</button>
            <Link to="/reset-password">
            <p className='forgot-pass'>Forgot Password ?</p>
            </Link>
            
          </div>
        </div>

        <span>Don't Have an Account?
          <Link to="/register">Register</Link>
        </span>
        
      </div>
      
    </div>
  
  )
}

export default Login
