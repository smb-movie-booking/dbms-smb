import React, { useState } from "react";
import  { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import './addMovie.css'
import { useAdmin } from "../../../hooks/auth/useAdmin";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("02:00:00"); // HH:MM:SS
  const [language, setLanguage] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState("");
  const {addMovie}=useAdmin();
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const validate=()=>{
    if(!title.trim() || !description.trim() || !duration || !language || !releaseDate || !genre || !image)return false

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid=validate();
    if(!isValid)return console.log("Not valid")

    const formData=new FormData();
    formData.append("title",title)
    formData.append("description",description)
    formData.append("duration",duration)
    formData.append("language",language)
    formData.append("releaseDate",releaseDate)
    formData.append("genre",genre)
    formData.append("image",image);
    try{
      setLoading(true);
      await addMovie(formData);
    }finally{
      setLoading(false);
    }

  };

  const handleImageUpload=(e)=>{
    const file=e.target.files[0];
    if(!file)return
    setImage(file); 

  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Add Movie</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: 640, display: "grid", gap: 8 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={4} />
          <input value={duration} onChange={e => setDuration(e.target.value)} placeholder="Duration (HH:MM:SS)" />
          <input value={language} onChange={e => setLanguage(e.target.value)} placeholder="Language" />
          <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} placeholder="Release date" />
          <input value={genre} onChange={e => setGenre(e.target.value)} placeholder="Genre" />


          <div className="upload-preview-container">
            {image && <div className="preview">
              <img src={image && URL.createObjectURL(image) } alt="poster-img" className="preview-img" />
            </div>}
            <input 
            onChange={handleImageUpload}
            type="file"
            accept="image/*"/>

          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" type="submit" disabled={loading}>{loading?"Adding....":"Add Movie"}</button>
            <button type="button" onClick={() => navigate("/admin")}>Cancel</button>
          </div>
        </form>
      </div>
    </>
  );
}
