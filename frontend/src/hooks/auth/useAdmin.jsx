import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios"

export const useAdmin=()=>{

    const addNewCity=async(cityData)=>{
        try {
            const {data}=await axiosInstance.post("/api/admin/addcity",cityData);
            toast.success(data.message)
            console.log(data);
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
            
        }
        

    }

    const addCinemas=async(cinemaData)=>{
        try {
            const {data}=await axiosInstance.post("/api/admin/cinemas",cinemaData);
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
            const {data}=await axiosInstance.post("/api/admin/cinema-halls",hallData);
            if(data.success){
                toast.success(data.message)
            }
            console.log(data)
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
        }
    }

    const addMovie=async(movieInfo)=>{
        try {
            const {data}=await axiosInstance.post("/api/admin/movie",movieInfo);
            if(data.success){
                return toast.success(data.message);
            }
            console.log(data)
        } catch (error) {
            toast.error(error.response.data.message ||  error.message)
        }
    }

    const addShow=async(showInfo)=>{
        try {
            const {data} = await axiosInstance.post("/api/admin/shows", showInfo);
            console.log(data);
            if(data.success){
                return toast.success(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
            
        }
    }

    return {addNewCity,addCinemas,addCinemaHall,addMovie,addShow}
}