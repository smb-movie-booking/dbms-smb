import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react'
import { useAuthError } from '../../hooks/auth/useAuthError';
import { useAuth } from '../../hooks/auth/useAuth';
import OtpField from '../../components/OtpField/OtpField';
import { useNavigate } from 'react-router-dom';
import './reset.css'
const ResetPassword = () => {

    const [newData,setNewData]=useState({phone:"",password:""});
    const [showPassword,setShowPassword]=useState(false);
    const [OtpForm,setOtpForm]=useState(false);
    const [otp,setOtp]=useState(new Array(6).fill(""));


    const{validateData,errors,setErrors}=useAuthError();
    const{resetPassword,getOtp,verifyOtp}=useAuth();
    const navigate=useNavigate();

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setNewData({...newData,[name]:value});
    }

    const passwordReset=async()=>{
        const valid=validateData(newData);
        if(valid){
            setErrors({});
            const isOtpSent=await getOtp({identifier:newData.phone,purpose:"reset"});
            if(isOtpSent){
                setOtpForm(true);
            }
        }
        else{
            return
        }
    }

    const submit=async(combinedOtp)=>{
        const {phone,password:newPassword}=newData;
        const data={identifier:phone,otp:combinedOtp}
        await verifyOtp(data);
       const isResetSuccess= await resetPassword({phone,newPassword,otp:combinedOtp});
       if(isResetSuccess){
        setOtpForm(false);
        navigate("/login");
       }
    }
  return (
    
    <div className='reset-wrapper'>
      {!OtpForm?<div className='input-cont'>
        <h2>Reset <span style={{color:"var(--secondary-color"}}>Password</span></h2>
      <div className='mobile'>
        <label>
            Mobile number
        </label>

        <input
        type='text'
        name='phone'
        value={newData.phone}
        onChange={handleChange}
        />
        {errors.mobile&&<p className='error'>{errors.mobile}</p>}
      </div>

       <div className='register-field'>
            <label className='field-name'>New Password</label>
            <div style={{position:"relative"}}>
              <input className=''
              value={newData.password}
              name='password'
              onChange={handleChange}
              type={`${showPassword?"text":"password"}`}
              placeholder='password'/>
              {errors.password&&<p className='error'>{errors.password}</p>}
             

              <span onClick={()=>setShowPassword(!showPassword)} style={{position:"absolute",right:"0",top:"20%"}}>{showPassword?<Eye/>:<EyeOff/>}</span>
            </div>
        </div>

        <button onClick={passwordReset}>Change Password</button>
      
    </div>:<OtpField otp={otp} setOtp={setOtp} submit={submit} phone={newData.phone}/>
    }
    </div>
    
  )
}

export default ResetPassword
