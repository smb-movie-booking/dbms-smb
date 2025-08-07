import React, { useRef, useState } from 'react'
import './register.css'
import OtpField from '../../components/OtpField/OtpField';
import { useAuth } from '../../hooks/auth/useAuth';
import {Link} from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';
import { useAuthError } from '../../hooks/auth/useAuthError';
const Register = () => {
  const inputref=useRef(null);
  const [isFocus,setIsFocus]=useState(null);
  const [formData,setFormData]=useState({name:"",password:"",phone:""})
  const [otp,setOtp]=useState(new Array(6).fill(""))
  //const [error,setError]=useState({});
  const [OtpForm,setOtpForm]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const {getOtp,verifyOtp,register}=useAuth();
  const {validateData,errors,setErrors}=useAuthError();




  const reqOtp=async()=>{
    const {phone}=formData;
    console.log(phone)

    const isValid=validateData(formData);
    if(!isValid){
      return
    }
 
    setErrors({});
    
    const isOtpSent=await getOtp({identifier:phone});
    if(isOtpSent){
      setOtpForm(true);
    }
    else{
      return
    }
  }

  const submit=async(combinedOtp)=>{
    const {phone}=formData;
    const data={identifier:phone,otp:combinedOtp}
    await verifyOtp(data)
    await register(formData)
    

  }
  return (
    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",paddingTop:"20px"}}>
      {!OtpForm?<div className='register-container'>
        <p className='header'>Get <span style={{color:"var(--secondary-color)"}}>Started</span></p>

        <div style={{padding:"8px 20px"}}>
          <div className='register-field'>
            <label className='field-name'>Your Name</label>
            <input className=''
            value={formData.name}
            onChange={(e)=>setFormData({...formData,name:e.target.value})}
            type='text'
            placeholder='Name'/>
            {errors.name && <p className='error'>{errors.name}</p>}
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


          <div style={{display:"flex",alignItems:"center"}}>
            <p>+91</p>

            <div>
              <input type='text'
              value={formData.phone}
              onChange={(e)=>setFormData({...formData,phone:e.target.value})}
              onFocus={()=>setIsFocus(true)}
              onBlur={()=>setIsFocus(false)}
              style={{borderBottom:isFocus?"1px solid red":"1px solid gray"}}
              placeholder='mobile number'/>
      
            </div>
            
          </div>
          {errors.mobile&&<p className='error'>{errors.mobile}</p>}
          <button className='otp-btn' onClick={reqOtp}>Get Otp</button>
        </div>

        <span>Already Have an Account?
          <Link to="/login">Login</Link>
        </span>
        
      </div>:<OtpField otp={otp} setOtp={setOtp} submit={submit} phone={formData.phone}/>}
      
    </div>
  )
}

export default Register
