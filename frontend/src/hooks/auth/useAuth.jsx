import { useContext } from 'react'
import {axiosInstance} from '../../utils/axios'
import { Auth } from '../../Context/AuthContext'
import toast from 'react-hot-toast';
export const useAuth=()=>{

    const {setAuthUser}=useContext(Auth);


    const getOtp=async(identifier)=>{
        try {
            const {data}=await axiosInstance.post("/auth/send-otp",identifier)
            console.log(data);
            return true;
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
        
    }

    const verifyOtp=async(otpData)=>{
        try {
            const {data}=await axiosInstance.post("/auth/verify-otp",otpData);
            console.log(data);
            
            
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
            
        }
    }

    const register=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/auth/register",userData);
            console.log(data);
            await getUser();
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
    }

    const login=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/auth/login",userData);
            console.log(data);
            await getUser();
        } catch (error) {
            console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
    }


    const getUser=async()=>{
        try {
            const {data}=await axiosInstance.get("/users/me");
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
            const {data}=await axiosInstance.get("/auth/logout");
            setAuthUser(null);
            toast.success(data);
        } catch (error) {
            console.log(error.response.data.message);
        }
        
    }

    const resetPassword=async(userData)=>{
        try {
            const {data}=await axiosInstance.post("/auth/reset-password",userData);
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

    return {getOtp,verifyOtp,register,login,getUser,logoutUser,resetPassword}
}