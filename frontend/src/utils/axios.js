import axios from 'axios'
console.log("VITE_API_URL:", process.env.VITE_API_URL);
export const axiosInstance=axios.create({
    baseURL:process.env.VITE_API_URL,
    withCredentials:true,
})