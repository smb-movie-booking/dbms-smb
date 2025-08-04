import {axiosInstance} from '../../utils/axios'
export const useAuth=()=>{
    const getOtp=async(identifier)=>{
        try {
            const {data}=await axiosInstance.post("/auth/send-otp",identifier)
            console.log(data);
        } catch (error) {
            console.log(error.response.data.message);
        }
        
    }

    const verifyOtp=async(otpData)=>{
        try {
            const {data}=await axiosInstance.post("/auth/verify-otp",otpData);
            console.log(data);
        } catch (error) {
            console.log(error.response.data.message);
            
        }
    }

    return {getOtp,verifyOtp}
}