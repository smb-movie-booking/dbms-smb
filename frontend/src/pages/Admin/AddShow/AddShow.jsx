import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../hooks/auth/useAdmin";
import toast from "react-hot-toast";

export default function AddShow() {
  const [movies, setMovies] = useState([]);
  const [halls, setHalls] = useState([]);
  const [movieId, setMovieId] = useState("");
  const [hallId, setHallId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [format, setFormat] = useState("2D");
  const [language, setLanguage] = useState("English");
  const [defaultPrice, setDefaultPrice] = useState(120.00);
  const navigate = useNavigate();
  const {addShow}=useAdmin();

  useEffect(() => {
    axiosInstance.get("/admin/movie").then(res => setMovies(res.data.movies)).catch(console.error);
    axiosInstance.get("/admin/detail/halls").then(res => setHalls(res.data.result)).catch(console.error);
  }, []);

  const validate=()=>{

    const today = new Date();
    const date=new Date(`${showDate}`)

    const todayStr=today.toDateString();
    const start=new Date(`${todayStr} ${startTime}`);
    const end=new Date(`${todayStr} ${endTime}`);

    const timediff=(end-start)/60000;
    console.log(timediff)

    if(date < today)return { result:false,message:"Invalid Date"}
    if(timediff <= 0 || timediff > 300)return { result:false,message:"Invalid Time"}
    return {result:true}
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(hallId)
    const valid=validate();
    if(!valid.result)return toast.error(valid.message);

    //try {
      const body = {
        MovieID: movieId,
        CinemaHallID: hallId,
        Show_Date: showDate || null,
        StartTime: startTime ? `${showDate} ${startTime}` : null,
        EndTime: endTime ? `${showDate} ${endTime}` : null,
        Format: format,
        Show_Language: language,
      };

      // create show
      
      const newShow = addShow(body); // expect { ShowID: ... }

      // call backend endpoint to populate show seats using stored proc
      /*await axiosInstance.post(`/admin/shows/${newShow.ShowID}/populate-seats`, {
        CinemaHallID: hallId,
        defaultPrice: defaultPrice
      });

      alert("Show created and seats populated");
      navigate("/admin/view-shows");
    } catch (err) {
      console.error(err);
      alert("Failed to create show: " + (err.response?.data?.message || err.message));
    }
      */
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Add Show</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 720, display: "grid", gap: 8 }}>
          <select value={movieId} onChange={e => setMovieId(e.target.value)} required>
            <option value="">Select Movie</option>
            {movies.map(m => <option key={m.MovieID} value={m.MovieID}>{m.Title}</option>)}
          </select>

          <select value={hallId} onChange={e => setHallId(e.target.value)} required>
            <option value="">Select Cinema Hall</option>
            { halls.length > 0 && halls?.map(h => <option key={h.CinemahallID} value={h.CinemahallID}>{h.Hall_Name} ( {h?.Cinema_Name})</option>)}
          </select>

          <input type="date" value={showDate} onChange={e => setShowDate(e.target.value)} required />
          <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
          <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} required />

          <input value={format} onChange={e => setFormat(e.target.value)} placeholder="Format (2D/3D/IMAX)" />
          <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Show language (override)" />
          <input type="number" step="0.01" value={defaultPrice} onChange={e => setDefaultPrice(e.target.value)} placeholder="Default seat price" />

          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit">Create Show</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
