import React  from "react";
import "./TheatersListPage.css";
import { useNavigate } from "react-router-dom";
import DateSelector from "../../components/DateSelector/DateSelector";

export default function TheaterShowtimes({ movies,selectedDate,setSelectedDate }) {
  const navigate = useNavigate();

  // ✅ Filter movies with at least one show
  const moviesWithShows = movies.filter(
    (movie) => movie.shows && movie.shows.length > 0
  );

  return (
    <div className="theater-container">
      {/* Header Date Row */}
      <div className="date-row">
        <DateSelector
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <div className="availability">
          <div className="availability-item">
            <span
              className="status-dot"
              style={{
                background: "#22c55e",
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 8,
                marginRight: 6,
              }}
            ></span>
            Available
          </div>
          <div className="availability-item">
            <span
              className="status-dot"
              style={{
                background: "#f59e0b",
                display: "inline-block",
                width: 8,
                height: 8,
                borderRadius: 8,
                marginRight: 6,
              }}
            ></span>
            Fast Filling
          </div>
        </div>
      </div>

      {/* Movies List */}
      <div>
        {moviesWithShows.length > 0 ? (
          moviesWithShows.map((movie, i) => (
            <div key={i} className="movie-block">
              <div
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "space-between",
                }}
              >
                {/* Left side: Movie Info */}
                <div>
                  <div className="movie-title">
                    {movie.Title}{" "}
                    <span
                      style={{
                        fontWeight: 400,
                        fontSize: "0.9rem",
                        color: "#6b7280",
                      }}
                    >
                      ({movie.Age_Format || "U"})
                    </span>
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "#dc2626" }}>
                    {movie.Movie_Language}, {movie.Format}
                  </div>
                </div>

                {/* Poster (optional) */}
                {movie.Poster_Image_URL && (
                  <img
                    src={movie.Poster_Image_URL}
                    alt={movie.Title}
                    style={{
                      height: 64,
                      width: 48,
                      objectFit: "cover",
                      borderRadius: 6,
                      display: "block",
                    }}
                  />
                )}
              </div>

              {/* Showtimes */}
              <div style={{ marginTop: 12 }}>
                {movie.shows.map((show, j) => (
                  <button
                    onClick={() => navigate(`/seat/show/${show.ShowID}`)}
                    key={j}
                    className="showtime"
                    title={`${show.Format ?? ""}`}
                  >
                    {show.ShowTime}{" "}
                    <span
                      style={{
                        color: "#16a34a",
                        fontSize: "0.75rem",
                        marginLeft: 6,
                      }}
                    >
                      {show.Format}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "#6b7280", fontSize: "0.95rem", marginTop: 20 }}>
            No movies available for this date.
          </div>
        )}
      </div>
    </div>
  );
}
