import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios"

export const useAdmin=()=>{

    const addNewCity=async(cityData)=>{
        try {
            const {data}=await axiosInstance.post("/admin/addcity",cityData);
            toast.success(data.message)
            console.log(data);
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
            
        }
        

    }

    const addCinemas=async(cinemaData)=>{
        try {
            const {data}=await axiosInstance.post("/admin/cinemas",cinemaData);
            if(data.success){
                toast.success(data.message)
            }
            console.log(data)
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
        }
    }

    const addCinemaHall=async(hallData)=>{
        try {
            const {data}=await axiosInstance.post("/admin/cinema-halls",hallData);
            if(data.success){
                toast.success(data.message)
            }
            console.log(data)
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
        }
    }

    return {addNewCity,addCinemas,addCinemaHall}
}