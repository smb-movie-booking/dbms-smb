import React, { useContext, useEffect, useState } from 'react'
import './profile.css'
import { Auth } from '../../Context/AuthContext'
import {Pencil} from 'lucide-react'
import Update from '../../components/UpdateDetails/Update'
import OtpField from '../../components/OtpField/OtpField'
import { useAuth } from '../../hooks/auth/useAuth'
import { useAuthError } from '../../hooks/auth/useAuthError'
import toast from 'react-hot-toast';
import EditDetails from '../../components/EditDetails/EditDetails'


const EditProfile = () => {
    const {authUser}=useContext(Auth);
    const [errors,setErrors]=useState({});
    const {getOtp,verifyOtp,updateEmail,updatePhone,deleteProfile}=useAuth();
    const [otp,setOtp]=useState(Array(6).fill(""));
    const [enableOtp,setEnableOtp]=useState(false);
    
    const [formData,setFormData]=useState({name:"",email:null,phone:""});
    const [showEditModal,setShowEditModal]=useState(false);
    const [value,setValue]=useState("");

    
    useEffect(()=>{
        setFormData(authUser?.user);
    },[])


   

    const handleEditModal=(text)=>{
        //const text=(e.currentTarget.textContent.trim());
        setValue(text);
        if(text){
            setShowEditModal(true);
        }
    }

    const initiateOtpVerification=async(identifierValue)=>{    

        if(formData[identifierValue]){
            const isOtpSent=await getOtp({identifier:formData[identifierValue]});
            if(isOtpSent){
                setEnableOtp(true);
                setShowEditModal(false);
            
            }   
        }
        else{
            return toast.error("formData");
        }

    }

    //console.log(formData);

    const submitOtp=async(combinedOtp)=>{
        const data={
            identifier:formData[value],
            otp:combinedOtp
        }

        const isVerified=await verifyOtp(data);
        if(isVerified){
            
            setEnableOtp(false);
            if(value && value=='email'){
                await updateEmail({email:formData?.email});
            }
            else if(value && value=='phone'){
                await updatePhone({phone:formData?.phone})
            }
            

        }
        else{
            return
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
        <form className='update-form' >
            <div className='input-box'>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <label >Your Name </label>
                    <span onClick={()=>handleEditModal("name")}>Edit <Pencil size={"17px"} stroke='var(--secondary-color)'/></span>
                </div>
                
                <input
                name='name'
                type='text'
                readOnly
                value={authUser.user?.name || ""}
                placeholder='Name'/>
                {errors.name&&<div className='error'>{errors.name}</div>}

            </div>

            <div className='input-box'>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <label >Email </label>
                    <span onClick={()=>handleEditModal("email")}>Edit <Pencil size={"17px"} stroke='var(--secondary-color)'/></span>
                </div>
                <input
                name='email'
                type='text'
                readOnly
                value={authUser.user?.email || ""}
                placeholder='Email'/>
                {errors.email&&<div className='error'>{errors.email}</div>}

            </div>

            <div className='input-box'>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                    <label >Mobile Number </label>
                    <span onClick={()=>handleEditModal("phone")}>Edit <Pencil size={"17px"} stroke='var(--secondary-color)'/></span>
                </div>
                <input
                name='phone'
                type='text'
                readOnly
                value={authUser.user?.phone || ""}
                placeholder='Mobile'/>
                {errors.mobile&&<div className='error'>{errors.mobile}</div>}

            </div>

            <div className='btn-cont'>
                <button type='button' onClick={deleteAccount}>Delete Account</button>
            </div>

            
        </form>


        {(enableOtp || showEditModal) && <div onClick={()=>{setEnableOtp(false);setShowEditModal(false)}} className='backdrop' style={{backdropFilter:"blur(3px)"}}/>}

        {enableOtp&&<div className='otp-box'>
            {enableOtp && <OtpField otp={otp} setOtp={setOtp} submit={submitOtp} media={formData[value]}/>}
        </div>}

        {showEditModal && <EditDetails value={value} formData={formData} setFormData={setFormData} sendOtp={initiateOtpVerification} setShowEditModal={setShowEditModal}/>}
        
      
    </div>
  )
}

export default EditProfile
