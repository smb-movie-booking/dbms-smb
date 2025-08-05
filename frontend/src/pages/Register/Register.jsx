import React, { useRef, useState } from 'react'
import './register.css'
import OtpField from '../../components/OtpField/OtpField';
import { useAuth } from '../../hooks/auth/useAuth';
import {Link} from 'react-router-dom'
const Register = () => {
  const inputref=useRef(null);
  const [isFocus,setIsFocus]=useState(null);
  //const [phoneNumber,setPhoneNumber]=useState("");
  const [formData,setFormData]=useState({name:"",password:"",phone:""})
  const [otp,setOtp]=useState(new Array(6).fill(""))
  const [error,setError]=useState({});
  const [OtpForm,setOtpForm]=useState(false);
  const {getOtp,verifyOtp,register}=useAuth();


const validateData=()=>{
  const {name,password,phone}=formData;
  let errors={};

  if(!name){
    errors.name="Please enter your name";
  }

  if(!password){
    errors.password="Password is required";
  }
  else if(password.length<6){
    errors.password="password must be min 6 character long";
  }

  const regex = /^[6-9]\d{9}$/;
  if(!regex.test(phone)){
    errors.mobile="Please enter a valid mobile number"
    setFormData({...formData,phone:""});
    
  }

  setError(errors);

  return Object.keys(errors).length===0

}
  const reqOtp=async()=>{
    const {phone}=formData;
    console.log(phone)

    const isValid=validateData();
    if(!isValid){
      return
    }
 
    setError("");
    setOtpForm(true);
    await getOtp({identifier:phone});
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
        <p className='header'>Get Started</p>

        <div style={{padding:"8px 20px"}}>
          <div className='register-field'>
            <label className='field-name'>Your Name</label>
            <input className=''
            value={formData.name}
            onChange={(e)=>setFormData({...formData,name:e.target.value})}
            type='text'
            placeholder='Name'/>
            {error.name && <p className='error'>{error.name}</p>}
          </div>

          <div className='register-field'>
            <label className='field-name'>Password</label>
            <input className=''
            value={formData.password}
            onChange={(e)=>setFormData({...formData,password:e.target.value})}
            type='password'
            placeholder='password'/>
            {error.password && <p className='error'>{error.password}</p>}
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
          {error.mobile&&<p className='error'>{error.mobile}</p>}
          <button className='otp-btn' onClick={reqOtp}>Get Otp</button>
        </div>

        <span>Already Have an Account?
          <Link to="/login">Login</Link>
        </span>
        
      </div>:<OtpField otp={otp} setOtp={setOtp} submit={submit}/>}
      
    </div>
  )
}

export default Register
