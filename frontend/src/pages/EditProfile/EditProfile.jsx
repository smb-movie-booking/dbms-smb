import React, { useContext, useEffect, useState } from 'react'
import './profile.css'
import { Auth } from '../../Context/AuthContext'
import {Pencil} from 'lucide-react'
import Update from '../../components/UpdateDetails/Update'
import OtpField from '../../components/OtpField/OtpField'
import { useAuth } from '../../hooks/auth/useAuth'
import { useAuthError } from '../../hooks/auth/useAuthError'
import toast from 'react-hot-toast';


const EditProfile = () => {
    const {authUser}=useContext(Auth);
    const {validateData,errors,setErrors}=useAuthError();
    const {getOtp,verifyOtp,updateProfile,deleteProfile}=useAuth();
    const [otp,setOtp]=useState(Array(6).fill(""));
    const [enableOtp,setEnableOtp]=useState(false);
    const [formData,setFormData]=useState({name:"",email:null,phone:""});

    useEffect(()=>{
        setFormData(authUser?.user);
    },[])

    const initiateOtpVerification=async()=>{

        

        if (JSON.stringify(authUser?.user) === JSON.stringify(formData)) {
            return toast("No Changes Have Been Made");
        }
        
        const isOtpSent=await getOtp({identifier:authUser?.user?.phone,purpose:"reset"});

        if(isOtpSent){
            setEnableOtp(true);
            
        }


    }

    const handleChange=(e)=>{
        let value=e.target.value;
        let field=e.target.name;

        setFormData({...formData,[field]:value});


    }

    const submitOtp=async(combinedOtp)=>{
        const {phone}=authUser?.user;
        const data={
            identifier:phone,
            otp:combinedOtp
        }

        const isVerified=await verifyOtp(data);
        if(isVerified){
            
            setEnableOtp(false);
            await updateProfile(formData);

        }
        else{
            return
        }
        


    }

    const updateChanges=(e)=>{
        e.preventDefault();
        const valid=validateData(formData);
        console.log(valid);
        console.log(errors);
        if(valid){
            setErrors({})
            initiateOtpVerification();
        }
        

    }

    const deleteAccount=async()=>{
        if(authUser.user){
            await deleteProfile();
        }

    }

  return (
    <div className='edit-wrapper'>
        
        <h1>Edit Your <span>Profile</span></h1>
        <form className='update-form' onSubmit={updateChanges}>
            <div className='input-box'>
                <label>Your Name</label>
                <input
                name='name'
                type='text'
                value={formData?.name || ""}
                onChange={handleChange}
                placeholder='Name'/>
                {errors.name&&<div className='error'>{errors.name}</div>}

            </div>

            <div className='input-box'>
                <label>Email</label>
                <input
                name='email'
                type='text'
                value={formData?.email || ""}
                onChange={handleChange}
                placeholder='Email'/>
                {errors.email&&<div className='error'>{errors.email}</div>}

            </div>

            <div className='input-box'>
                <label>Mobile Number</label>
                <input
                name='phone'
                type='text'
                value={formData?.phone || ""}
                onChange={handleChange}
                placeholder='Mobile'/>
                {errors.mobile&&<div className='error'>{errors.mobile}</div>}

            </div>

            <div className='btn-cont'>
                <button>Save Changes</button>
                <button type='button' onClick={deleteAccount}>Delete Account</button>
            </div>

            
        </form>


        {enableOtp && <div onClick={()=>setEnableOtp(false)} className='backdrop' style={{backdropFilter:"blur(3px)"}}/>}

        {enableOtp&&<div className='otp-box'>
            {enableOtp && <OtpField otp={otp} setOtp={setOtp} submit={submitOtp} phone={authUser?.user?.phone}/>}
        </div>}
        
      
    </div>
  )
}

export default EditProfile
