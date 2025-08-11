import React, { useContext, useEffect, useState } from 'react'
import './edit.css'
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/auth/useAuth';
import { Auth } from '../../Context/AuthContext';
const EditDetails = ({value,formData,setFormData,sendOtp,setShowEditModal}) => {
    const {updateName}=useAuth();
    const {authUser}=useContext(Auth);
    
    console.log(value)

    const handleChange=(e)=>{
        let value=e.target.value;
        let field=e.target.name;
        

        setFormData({...formData,[field]:value});


    }

    const checkErrors=()=>{
        
        const {name,email,phone}=formData;
         const phoneRegex = /^[6-9]\d{9}$/;
    

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(value==='email' && !emailRegex.test(email)){
            toast.error("Use a Valid Email");
            return false;
        }

        else if(value==='phone' && !phoneRegex.test(phone)){
            toast.error("Use a valid Phone");
            return false
        }

        

        return true;

    }

    const handleClick=async()=>{

        const valid=checkErrors();
        if(valid){
            sendOtp(value)   
        }

    }

    const handleUpdateName=async()=>{
        const {name}=formData;
        if(name === authUser?.user?.name ){
            return toast.error("Name hasnt been changed");
        }
        else if(name.trim() ){
            const isChanged=await updateName({name});
            if(isChanged){
                setShowEditModal(false);
            }
        }
    }
  return (
    <div className='modal-wrapper update-form'>
        <div className='modal-title'>
            <h4>{`Edit Your ${value.toUpperCase()}`}</h4>
            <p>{`The ${value} will be verified by an OTP`}</p>
        </div>

       {<div className='input-box'>
            <label>{`Enter a valid ${value} below`}</label>
            <input
            name={value}
            type='text'
            onChange={handleChange}
            placeholder={value}/>
            

        </div>}

        {value!=="name"?<button onClick={handleClick}>Verify via OTP</button>:<button onClick={handleUpdateName}>Update Name</button>}
    </div>
  )
}

export default EditDetails
