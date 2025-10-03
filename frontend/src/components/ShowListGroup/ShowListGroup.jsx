import React from 'react';
import './ShowListGroup.css';
import { useNavigate } from 'react-router-dom';

/**
 * A component that displays a group of showtimes for a single theater.
 * @param {string} title - The name of the theater.
 * @param {array} shows - An array of show objects for that theater.
 * @param {function} onTitleClick - A function to call when the theater title is clicked.
 */
const ShowListGroup = ({ title, shows, onTitleClick }) => {
  const navigate=useNavigate();
  return (
    <div className="show-list-group">
      {/* The theater title is now a clickable element */}
      <h3 className="theater-title" onClick={onTitleClick}>
        {title}
      </h3>
      
      <div className="showtimes-container">
        {shows.map((show) => (
          // Each showtime is a button-like div
          <div key={show.showId} className="showtime-button" onClick={()=>navigate(`/seat/show/${show.showId}`)}>
            <div className="time">{show.startTime}</div>
            <div className="format">{show.format}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowListGroup;

