import { useState } from "react";

export const useAuthError=()=>{
    const [errors,setErrors]=useState({});
    const validateData=(formData)=>{
        const {name,password,phone}=formData;
        let errors={};

        if(name!==undefined && !name.trim()){
            errors.name="Please enter your name";
        }

        if(password!==undefined && !password){
            errors.password="Password is required";
        }
        else if(password.length<6){
            errors.password="password must be min 6 character long";
        }

        const regex = /^[6-9]\d{9}$/;
        if(!regex.test(phone)){
            errors.mobile="Please enter a valid mobile number"
            
            
        }

        setErrors(errors);

        return Object.keys(errors).length===0
    }

    return {validateData,errors,setErrors}
}