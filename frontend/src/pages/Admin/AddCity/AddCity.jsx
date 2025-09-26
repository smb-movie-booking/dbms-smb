import React, { useEffect, useRef, useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdmin } from "../../../hooks/auth/useAdmin";

export default function AddCity() {
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("Kerala");
  const [zip, setZip] = useState("");
  const [loading,setLoading]=useState(false);

  const {addNewCity}=useAdmin();
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!cityName.trim() || !stateName.trim() || !zip.trim()) return toast.error("All fields are required");
    const zipRegex=/^\d+$/
    if(zip.length !==6 || !zipRegex.test(zip) ) return toast.error("Use a valid Zip")
    try{
      setLoading(true);
      await addNewCity({cityName,stateName,zip});
      navigate("/admin/view-cities");
    }finally{
      setLoading(false)
    }
  };

  return (
    <>
      <div className="admin-container" style={{ padding: 24 }}>
        <h2>Add City</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 480 }}>
          <input value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="City Name" required />
          <input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" required />
          <input value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip code" />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={loading}>Add City</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
