import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../utils/axios";
import Navbar from "../../../components/Navbar/Navbar";
import toast from "react-hot-toast";

export default function ViewCities() {
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axiosInstance.get("/admin/cities")
      .then(res => setCities(res.data.cities))
      .catch(err => toast.error(err.response.data.message || err.message));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this city?")) return;
    try {
      const {data}=await axiosInstance.delete(`/admin/cities/${id}`);
      toast.success(data.message)
      setCities(prev => prev.filter(c => c.CityID !== id));
    } catch (err) {
      alert("Could not delete: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        <h2>Cities</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr><th>CityID</th><th>Name</th><th>State</th><th>Zip</th><th>Action</th></tr>
          </thead>
          <tbody>
            {cities.map(c => (
              <tr key={c.CityID}>
                <td>{c.CityID}</td>
                <td>{c.City_Name}</td>
                <td>{c.City_State}</td>
                <td>{c.ZipCode}</td>
                <td><button onClick={() => handleDelete(c.CityID)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
