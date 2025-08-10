import { useState } from "react";

export const useAuthError=()=>{
    const [errors,setErrors]=useState({});
    const validateData=(formData)=>{
        const {name,email,password,phone}=formData;
        let errors={};
        console.log(email);

        if(name!==undefined && !name.trim()){
            errors.name="Please enter your name";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email!==undefined && !emailRegex.test(email)){
            errors.email="Please enter a valid email"

        }

        if(password!==undefined){
            if(!password){
                errors.password="Password is required";
            }
            
            else if(password.length<6){
                errors.password="password must be min 6 character long";
            }
        }
        

        const regex = /^[6-9]\d{9}$/;
        if(!regex.test(phone)){
            errors.mobile="Please enter a valid mobile number"
            
            
        }

        setErrors(errors);
        console.log(Object.keys(errors).length);
        return Object.keys(errors).length===0
    }

    return {validateData,errors,setErrors}
}