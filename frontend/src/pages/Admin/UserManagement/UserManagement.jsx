import React, { useState, useEffect, useRef } from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';

// --- (1) HELPER HOOK & COMPONENTS ---

// Debounce hook for search inputs
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// Simple Modal Component
const Modal = ({ children, onClose }) => {
    const modalRef = useRef();
    
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    return (
        <div style={styles.modalBackdrop}>
            <div style={styles.modalContent} ref={modalRef}>
                <button onClick={onClose} style={styles.modalCloseButton}>&times;</button>
                {children}
            </div>
        </div>
    );
};

// Simple Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '16px' }}>
            <button style={styles.button} onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}>
                &laquo; Prev
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button style={styles.button} onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>
                Next &raquo;
            </button>
        </div>
    );
};

// --- (2) STYLES INJECTION FOR TOGGLE ---
// This injects the CSS needed for the toggle switch's ::before pseudo-element

const toggleStyleSheet = `
    input:checked + .toggle-slider {
        background-color: rgb(235, 95, 40);
    }
    input:checked + .toggle-slider:before {
        transform: translateX(22px);
    }
    .toggle-slider:before {
        position: absolute;
        content: "";
        height: 20px;
        width: 20px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }
`;

// A simple component to inject the styles once
const ToggleStyles = () => {
    useEffect(() => {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = toggleStyleSheet;
        document.head.appendChild(styleEl);
        return () => {
            document.head.removeChild(styleEl);
        };
    }, []);
    return null;
};

// --- (3) USER MANAGEMENT PAGE ---

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    
    const [params, setParams] = useState({ search: '', page: 1 });
    const debouncedSearch = useDebounce(params.search, 500);

    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetails, setUserDetails] = useState({ bookings: [], reviews: [] });
    const [loadingDetails, setLoadingDetails] = useState(false);

    const cacheBustConfig = {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    };

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ ...params, search: debouncedSearch });
            const res = await axiosInstance.get(`/api/admin/users?${query.toString()}`, cacheBustConfig);
            setUsers(res.data.users);
            setPagination(res.data.pagination);
        } catch (e) {
            toast.error("Failed to fetch users.");
        }
        setLoading(false);
    };

    // Fetch users when params change
    useEffect(() => {
        fetchUsers();
    }, [debouncedSearch, params.page]);

    const handleParamChange = (key, value) => {
        setParams(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setParams(prev => ({ ...prev, page: newPage }));
    };

    // Toggle Admin Status
    const handleToggleAdmin = async (e, userId) => {
        e.stopPropagation(); // Prevent modal from opening
        
        if (!confirm("Are you sure you want to change this user's admin status?")) {
            return;
        }

        try {
            await axiosInstance.put(`/api/admin/users/${userId}/toggle-admin`);
            toast.success("User status updated!");
            fetchUsers(); // Refetch the list
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status.");
        }
    };

    // Open User Details Modal
    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setLoadingDetails(true);
        try {
            const res = await axiosInstance.get(`/api/admin/users/${user.UserID}/details`, cacheBustConfig);
            setUserDetails(res.data);
        } catch (e) {
            toast.error("Failed to fetch user details.");
            setSelectedUser(null); // Close modal on error
        }
        setLoadingDetails(false);
    };

    // Delete a Review
    const handleDeleteReview = async (reviewId) => {
        if (!confirm("Are you sure you want to delete this review? This action is permanent.")) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/admin/reviews/${reviewId}`);
            toast.success("Review deleted.");
            // Refresh the details in the modal
            setUserDetails(prev => ({
                ...prev,
                reviews: prev.reviews.filter(r => r.ReviewID !== reviewId)
            }));
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete review.");
        }
    };

    return (
        <div style={styles.container}>
            <ToggleStyles /> {/* <-- Injects CSS for the toggle */}
            <h1 style={styles.title}>User Management</h1>

            {/* --- Search Bar --- */}
            <div style={styles.filterBar}>
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Phone..."
                    value={params.search}
                    onChange={e => handleParamChange('search', e.target.value)}
                    style={styles.searchInput}
                />
            </div>

            {/* --- User Table --- */}
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>User ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Phone</th>
                            <th style={styles.th}>Is Admin?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.UserID} style={styles.tr} onClick={() => handleUserClick(user)}>
                                <td style={styles.td}>{user.UserID}</td>
                                <td style={styles.td}>{user.User_Name}</td>
                                <td style={styles.td}>{user.Email}</td>
                                <td style={styles.td}>{user.Phone}</td>
                                <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                                    <label style={styles.toggleLabel}>
                                        <input
                                            type="checkbox"
                                            checked={Boolean(user.IsAdmin)}
                                            onChange={(e) => handleToggleAdmin(e, user.UserID)}
                                            style={styles.toggleCheckbox}
                                        />
                                        {/* This class name 'toggle-slider' is targeted by the ToggleStyles component */}
                                        <span style={styles.toggleSlider} className="toggle-slider"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
            />

            {/* --- User Details Modal --- */}
            {selectedUser && (
                <Modal onClose={() => setSelectedUser(null)}>
                    {loadingDetails ? (
                        <p>Loading details...</p>
                    ) : (
                        <div>
                            <h2 style={styles.modalTitle}>User Details: {selectedUser.User_Name}</h2>
                            <p><strong>Email:</strong> {selectedUser.Email}</p>
                            <p><strong>Phone:</strong> {selectedUser.Phone}</p>
                            
                            <hr style={styles.hr} />

                            <h3 style={styles.modalSubtitle}>Recent Bookings</h3>
                            <div style={styles.modalSection}>
                                {userDetails.bookings.length > 0 ? (
                                    userDetails.bookings.map(book => (
                                        <div key={book.BookingID} style={styles.itemCard}>
                                            <p><strong>Movie:</strong> {book.Title}</p>
                                            <p><strong>Date:</strong> {new Date(book.StartTime).toLocaleString()}</p>
                                            <p><strong>Status:</strong> {book.Booking_Status === 2 ? 'Confirmed' : (book.Booking_Status === 1 ? 'Pending' : 'Cancelled')}</p>
                                        </div>
                                    ))
                                ) : <p>No bookings found for this user.</p>}
                            </div>

                            <h3 style={styles.modalSubtitle}>Recent Reviews</h3>
                            <div style={styles.modalSection}>
                                {userDetails.reviews.length > 0 ? (
                                    userDetails.reviews.map(review => (
                                        <div key={review.ReviewID} style={styles.itemCard}>
                                            <div style={styles.reviewHeader}>
                                                <p><strong>Movie:</strong> {review.Title} (<strong>{review.Rating}/10</strong>)</p>
                                                <button 
                                                    style={{...styles.button, ...styles.deleteButton}}
                                                    onClick={() => handleDeleteReview(review.ReviewID)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <p style={styles.reviewComment}>"{review.Comment}"</p>
                                        </div>
                                    ))
                                ) : <p>No reviews found for this user.</p>}
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
}

// --- (4) STYLES ---

const styles = {
    container: {
        fontFamily: "'Poppins', sans-serif"
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        color: '#363431', // --accent-color
        marginBottom: '24px'
    },
    filterBar: {
        marginBottom: '24px',
    },
    searchInput: {
        fontFamily: "'Poppins', sans-serif",
        padding: '10px 14px',
        fontSize: '16px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(195, 195, 195, 1)', // --primary-color
        borderRadius: '8px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        background: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    },
    th: {
        fontFamily: "'Poppins', sans-serif",
        background: '#f9f9f9',
        padding: '12px 16px',
        borderBottom: '1px solid #eee',
        textAlign: 'left',
        color: '#363431',
        fontWeight: '600',
    },
    tr: {
        cursor: 'pointer',
        transition: 'background 0.2s ease',
    },
    td: {
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
        color: '#333',
    },
    button: {
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        padding: '6px 12px',
        border: 'none',
        borderRadius: '6px',
        background: 'rgb(235, 95, 40)', // --secondary-color
        color: 'white',
        fontSize: '14px',
    },
    deleteButton: {
        background: '#dc3545',
    },
    
    // Toggle Switch
    toggleLabel: {
        position: 'relative',
        display: 'inline-block',
        width: '50px',
        height: '28px',
    },
    toggleCheckbox: {
        opacity: 0,
        width: 0,
        height: 0,
    },
    toggleSlider: {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#ccc',
        transition: '.4s',
        borderRadius: '28px',
    },
    
    // Modal
    modalBackdrop: { // <-- CORRECTED
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modalContent: {
        background: 'white',
        padding: '24px',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '700px', // Wider modal for details
        position: 'relative',
        fontFamily: "'Poppins', sans-serif",
    },
    modalCloseButton: { // <-- CORRECTED
        position: 'absolute', top: '15px', right: '15px', background: 'transparent',
        border: 'none', fontSize: '24px', cursor: 'pointer',
        color: '#aaa', lineHeight: 1
    },
    modalTitle: {
        fontFamily: "'Poppins', sans-serif",
        color: '#363431',
        marginTop: 0
    },
    modalSubtitle: {
        fontFamily: "'Poppins', sans-serif",
        borderBottom: '1px solid #eee',
        paddingBottom: '8px',
        marginTop: '24px'
    },
    modalSection: {
        maxHeight: '200px',
        overflowY: 'auto',
        padding: '8px',
        background: '#f8f9fa',
        borderRadius: '6px'
    },
    itemCard: {
        background: '#fff',
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '10px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    reviewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewComment: {
        fontStyle: 'italic',
        color: '#555',
        marginTop: '8px',
    },
    hr: {
        border: 0,
        borderTop: '1px solid #eee',
        margin: '20px 0'
    }
};