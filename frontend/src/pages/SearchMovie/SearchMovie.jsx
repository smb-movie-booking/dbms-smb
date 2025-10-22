import { axiosInstance } from "../../utils/axios";
import { useEffect, useState } from "react";
import "./SearchMovie.css";
import { useNavigate } from "react-router-dom";

export function SearchMovie({ selectedCity }) {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    // guard: do not call API until selectedCity is available
    const cityParam = selectedCity?.id ?? selectedCity?.CityID ?? selectedCity;
    if (!cityParam) {
      setTheaters([]);
      return;
    }

    const getTheaters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get("/api/theaters/lookup", {
          params: { city: cityParam },
        });
        setTheaters(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch theaters:", err);
        setError(err?.response?.data?.error || err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    getTheaters();
  }, [selectedCity]);

  // simple loading / error UI
  if (loading) return <div className="container">Loading cinemas…</div>;
  if (error) return <div className="container">Error: {error}</div>;
  const handleTheaterClick = (id)=>{
    navigate(`/theatermovies/${id}`)
  }
  return (
    <div className="container">
      <div className="header">
        <h2>Cinemas</h2>
      </div>

      <div className="cinema-grid">
        {theaters.length === 0 ? (
          <div className="no-cinemas">
            No cinemas found for the selected city.
          </div>
        ) : (
          theaters.map((theater) => {
            // support different field names returned by backend
            const id = theater.cinemaId ?? theater.CinemaID ?? theater.id;
            const name = theater.cinemaName ?? theater.Cinema_Name ?? "Unknown Cinema";
            const address = theater.address ?? theater.fullAddress ?? theater.location ?? "";
            const facilities = theater.facilities ?? theater.Facilities ?? [];
            const cancellation = theater.cancellationAllowed ?? theater.Cancellation_Allowed ?? false;

            return (
              <div key={id} className="cinema-card" data-id={id} onClick={()=>{handleTheaterClick(id)}}>
                <h3>{name}</h3>
                {Array.isArray(facilities) && facilities.length > 0 && (
                  <p className="facilities">{facilities.join(" • ")}</p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
