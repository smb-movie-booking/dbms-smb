import React, { useEffect, useRef, useState } from 'react'
import './otp.css'
const OtpField = ({otp,setOtp,submit,phone}) => {
    
    const inputRef=useRef([])

    useEffect(()=>{
        inputRef.current[0]?.focus();
    },[])


    useEffect(()=>{
        const combinedOtp=otp.join("");
        
        if(combinedOtp.length===otp.length){
            submit(combinedOtp);
        }
    },[otp])

    const handleChange=(index,e)=>{
        const value=e.target.value;
        
        if(isNaN(value)){
            return
        }

        const newOtp=[...otp];
        newOtp[index]=value.substring(value.length-1);  
        setOtp(newOtp);

        if(value&&index<otp.length-1&&inputRef.current[index+1]){
            inputRef.current[index+1].focus();
        }

        

        
    }

    const handleKeyDown=(index,e)=>{
        //e.preventDefault();
        if(e.key==="Backspace" && index>0 && inputRef.current[index-1] &&!otp[index]){
            const newOtp=[...otp];
            newOtp[index]="";
            setOtp(newOtp);
            inputRef.current[index-1].focus();
        }

    }

    
    console.log(otp);
  return (
    <div>
        <h3>Verify Its  <span>You</span></h3>
        <p style={{textAlign:"center"}}>{`Enter the Otp sent to (+91-) ${phone}`}</p>

        <div className='input-container'>
            {otp.map((value,index)=>{
                return <input 
                key={index}
                value={value}
                onChange={(e)=>handleChange(index,e)} 
                onKeyDown={(e)=>handleKeyDown(index,e)}
                ref={(input)=>inputRef.current[index]=input} 
                className='otp-input'/>
            })}
        </div>

        
      
    </div>
  )
}

export default OtpField
