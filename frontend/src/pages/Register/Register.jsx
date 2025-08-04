import React, { useRef, useState } from 'react'
import './register.css'
import OtpField from '../../components/OtpField/OtpField';
import { useAuth } from '../../hooks/auth/useAuth';
const Register = () => {
  const inputref=useRef(null);
  const [isFocus,setIsFocus]=useState(null);
  const [phoneNumber,setPhoneNumber]=useState("");
  const [otp,setOtp]=useState(new Array(6).fill(""))
  const [error,setError]=useState("");
  const [OtpForm,setOtpForm]=useState(false);
  const {getOtp,verifyOtp}=useAuth();



  const reqOtp=async()=>{
    console.log(phoneNumber);
    const regex = /^[6-9]\d{9}$/;
    if(!regex.test(phoneNumber)){
      setError("Please enter a valid mobile number");
      setPhoneNumber("");
      return;

    }
    setError("");
    setOtpForm(true);
    await getOtp({identifier:phoneNumber});
  }

  const submit=async(combinedOtp)=>{

    const data={identifier:phoneNumber,otp:combinedOtp}
    await verifyOtp(data)
    

  }
  return (
    <div style={{width:"100%",height:"100%",display:"flex",justifyContent:"center",paddingTop:"20px"}}>
      {!OtpForm?<div className='register-container'>
        <p className='header'>Get Started</p>

        <div style={{padding:"8px 20px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p>+91</p>

            <div>
              <input type='text'
              value={phoneNumber}
              onChange={(e)=>setPhoneNumber(e.target.value)}
              onFocus={()=>setIsFocus(true)}
              onBlur={()=>setIsFocus(false)}
              style={{borderBottom:isFocus?"1px solid red":"1px solid gray"}}
              placeholder='mobile number'/>
      
            </div>
            
          </div>
          {error&&<p className='error'>{error}</p>}
          <button className='otp-btn' onClick={reqOtp}>Get Otp</button>
        </div>
      </div>:<OtpField otp={otp} setOtp={setOtp} submit={submit}/>}
      
    </div>
  )
}

export default Register
