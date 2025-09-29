import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import './TheaterDetailsModal.css'; // The CSS you provided

const TheaterDetailsModal = ({ theater, onClose }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs whenever a new theater is selected.
    if (theater) {
      setLoading(true);
      // As per your backend plan, we fetch details using the '/theaters/lookup' endpoint.
      axiosInstance.get(`/theaters/lookup?theater=${theater.CinemaID}`)
        .then(response => {
          setDetails(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching theater details:", err);
          setLoading(false);
        });
    }
  }, [theater]); // The dependency array ensures this runs when the 'theater' prop changes.

  // If no theater is passed as a prop, the component renders nothing.
  if (!theater) {
    return null;
  }

  return (
    // The semi-transparent background overlay. Clicking it closes the modal.
    <div className="modal-overlay" onClick={onClose}>
      {/* The main content box of the modal. Clicking inside it does NOT close the modal. */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h3>{theater.cinemaName}</h3>
        
        {loading ? <p>Loading details...</p> : (
          details && (
            <div>
              {/* You can add an address here once it's in your database */}
              {/* <p className="address">{details.Address}</p> */}
              
              <div className="facilities">
                <h4>Available Facilities:</h4>
                <p>{details.Facilities || 'Information not available.'}</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TheaterDetailsModal;

