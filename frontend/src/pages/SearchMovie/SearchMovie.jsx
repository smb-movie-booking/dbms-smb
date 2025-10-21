import { axiosInstance } from "../../utils/axios";
import { useEffect,useState } from "react";
import "./SearchMovie.css";
export function SearchMovie() {
    const [theaters,setTheaters] = useState([]);

    useEffect(()=>{
        const getTheaters = async ()=>{
            try{
                const response = await axiosInstance.get('/api/theaters')
            setTheaters(response.data)
            }catch(error){
                console.error("Failed to fetch error:",error)
            }
            
        }
        getTheaters();
    })
    console.log("hello")
    console.log(theaters)
  return (
    <div className="container">
      <div className="header">
        <h2>Cinema In Kochi</h2>
        <input
          type="text"
          placeholder="Search by cinema or area"
          className="search"
        />
      </div>

      <div className="cinema-grid">
        {/* {theaters.map((theater)=>{
            return (
                
            )
        })} */}
        <div className="cinema-card">
          <span className="heart">♡</span>
          <h3>PVR: Lulu, Kochi</h3>
          <p>
            Lulu International Shopping Mall, Edappally, Nethaji Nagar, Kochi,
            Kerala 682024, India
          </p>
        </div>
      </div>
    </div>
  );
}
