import { useContext } from 'react'
import {axiosInstance} from '../../utils/axios'
import { Auth } from '../../Context/AuthContext'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';
export const useAuth=()=>{
    const navigate=useNavigate()
    const {setAuthUser}=useContext(Auth);


    const getOtp=async(identifier)=>{
        try {
            const {data}=await axiosInstance.post("/api/auth/send-otp",identifier)
            console.log(data);
            return true
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
        
    }

    const verifyOtp=async(otpData)=>{
        try {
            const {data}=await axiosInstance.post("/api/auth/verify-otp",otpData);
            console.log(data);
            if(data.success){
                return true;
            }
            
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
            
        }
    }

    const register=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/api/auth/register",userData);
            console.log(data);
            await getUser();
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
    }

    const login=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/api/auth/login",userData);
            if(data.success){
                await getUser();
                return true
            }
            
            console.log(data);
            
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
    }


    const getUser=async()=>{
        try {
            const {data}=await axiosInstance.get("/api/users/me");
            console.log(data);
            if(data){
                setAuthUser(data);
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }


    const logoutUser=async()=>{
        try {
            const {data}=await axiosInstance.get("/api/auth/logout");
            setAuthUser(null);
            toast.success(data);
        } catch (error) {
            console.log(error.response.data.message);
        }
        
    }

    const resetPassword=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/api/auth/reset-password",userData);
            setAuthUser(null);
            console.log(data);
            toast.success("Password changed successfully");
            if(data.message){
                return true;
            }
            
            
        } catch (error) {
            console.log(error.response.data.message);
        }
    }


    const updateEmail=async(userData)=>{
        try {
            const {data}=await axiosInstance.put("/api/users/update-email",userData);
            if(data.success){
                console.log(data);
                toast.success(data.message);
                await getUser();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const updatePhone=async(userData)=>{
        try {
            const {data}=await axiosInstance.put("/api/users/update-phone",userData);
            if(data.success){
                console.log(data);
                toast.success(data.message);
                await getUser();
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const updateName=async(userData)=>{
        try {
            const {data}=await axiosInstance.put("/api/users/update-name",userData);
            if(data.success){
                console.log(data);
                toast.success(data.message);
                await getUser();
                return true
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }


    const deleteProfile=async()=>{
        try {
            const {data}=await axiosInstance.delete("/api/users/me");
            console.log(data);
            if(data.success){
                toast.success(data.message);
                setAuthUser(null);
                navigate("/")
            }
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    return {getOtp,verifyOtp,register,login,getUser,logoutUser,resetPassword,updateEmail,updatePhone,updateName,deleteProfile}
}