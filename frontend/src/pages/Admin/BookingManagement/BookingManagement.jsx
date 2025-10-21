import React, { useState } from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';

// --- (1) BOOKING MANAGEMENT PAGE (Refactored) ---

export default function BookingManagement() {
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingResults, setBookingResults] = useState([]); // Changed to an array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cacheBustConfig = {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    };

    const handleSearch = async () => {
        if (!searchTerm) {
            toast.error("Please enter a Booking ID, Email, or Phone Number.");
            return;
        }
        setLoading(true);
        setError('');
        setBookingResults([]); // Clear previous results
        try {
            // Updated to use the new search endpoint
            const res = await axiosInstance.get(`/api/admin/bookings/search?term=${searchTerm}`, cacheBustConfig);
            setBookingResults(res.data.bookings); // Set the array of results
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Error fetching bookings.";
            setError(errorMsg);
            toast.error(errorMsg);
        }
        setLoading(false);
    };

    const handleCancel = async (bookingId) => {
        if (!bookingId) return;
        
        if (!confirm(`Are you sure you want to cancel Booking ID: ${bookingId}? This will release the seats.`)) {
            return;
        }

        try {
            await axiosInstance.put(`/api/admin/bookings/${bookingId}/cancel`);
            toast.success(`Booking ${bookingId} cancelled successfully!`);
            // Remove the cancelled booking from the list
            setBookingResults(prev => prev.filter(b => b.BookingID !== bookingId));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to cancel booking.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Booking Management</h1>
            <p style={{ color: '#555', marginTop: '-16px', marginBottom: '24px' }}>
                Find 'Confirmed' bookings by ID, User Email, or User Phone to process cancellations.
            </p>

            {/* --- Search Bar --- */}
            <div style={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Enter Booking ID, Email, or Phone..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                />
                <button style={styles.button} onClick={handleSearch} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* --- Error Message --- */}
            {error && !loading && <p style={styles.errorText}>{error}</p>}

            {/* --- Booking Details Results --- */}
            {bookingResults.length > 0 && (
                <div style={styles.resultsContainer}>
                    <h2 style={styles.subtitle}>Found {bookingResults.length} Confirmed Booking(s)</h2>
                    {bookingResults.map(booking => (
                        <div key={booking.BookingID} style={styles.detailsContainer}>
                            <div style={styles.grid}>
                                <div><strong>Booking ID:</strong> {booking.BookingID}</div>
                                <div><strong>Status:</strong> <strong style={{ color: 'green' }}>Confirmed</strong></div>
                                <div><strong>User:</strong> {booking.User_Name || 'N/A'}</div>
                                <div><strong>Email:</strong> {booking.Email || 'N/A'}</div>
                                <div><strong>Phone:</strong> {booking.Phone || 'N/A'}</div>
                                <div><strong>Movie:</strong> {booking.Title}</div>
                                <div><strong>Showtime:</strong> {new Date(booking.StartTime).toLocaleString()}</div>
                                <div><strong>Cinema:</strong> {booking.Cinema_Name}</div>
                                <div><strong>Hall:</strong> {booking.Hall_Name}</div>
                                <div><strong>Seats ({booking.NumberOfSeats}):</strong> {booking.SeatNames}</div>
                                <div><strong>Total Price:</strong> ₹{parseFloat(booking.TotalPrice || 0).toFixed(2)}</div>
                            </div>
                            
                            <hr style={styles.hr} />

                            <button
                                style={{...styles.button, ...styles.cancelButton}}
                                onClick={() => handleCancel(booking.BookingID)}
                            >
                                Cancel This Booking
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- (2) STYLES ---

const styles = {
    container: {
        fontFamily: "'Poppins', sans-serif"
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        color: '#363431', // --accent-color
        marginBottom: '24px'
    },
    searchBar: {
        display: 'flex',
        gap: '10px',
        marginBottom: '24px',
    },
    searchInput: {
        fontFamily: "'Poppins', sans-serif",
        padding: '10px 14px',
        fontSize: '16px',
        flex: 1,
        maxWidth: '400px',
        border: '1px solid rgba(195, 195, 195, 1)', // --primary-color
        borderRadius: '8px',
    },
    button: {
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        padding: '0 20px',
        border: 'none',
        borderRadius: '8px',
        background: 'rgb(235, 95, 40)', // --secondary-color
        color: 'white',
        fontSize: '16px',
        fontWeight: '500',
    },
    errorText: {
        color: 'red',
        fontWeight: '500',
        padding: '16px',
        background: '#fffbe6',
        border: '1px solid #ffe58f',
        borderRadius: '8px',
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px' // Space between booking cards
    },
    detailsContainer: {
        background: '#fff',
        padding: '24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    subtitle: {
        fontFamily: "'Poppins', sans-serif",
        marginTop: 0,
        borderBottom: '1px solid #eee',
        paddingBottom: '12px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        fontSize: '16px',
    },
    hr: {
        border: 0,
        borderTop: '1px solid #eee',
        margin: '24px 0'
    },
    cancelButton: {
        background: '#dc3545',
        padding: '12px 24px',
        fontSize: '16px',
    }
};