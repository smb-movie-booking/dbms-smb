import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// Styles for the new top-bar layout
const styles = {
  layout: {
    fontFamily: "'Poppins', sans-serif",
    background: 'rgb(250, 249, 246)', // Your main body background
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px', // Add padding to the sides
    height: '70px',
    background: 'rgba(54, 52, 49, 1)', // Your --accent-color
    color: 'rgba(204, 197, 185, 1)', // Your --neutral-color
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    color: '#ffffff',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: '600',
    fontSize: '24px',
  },
  headerNav: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    gap: '20px', // Spacing between nav items
  },
  content: {
    padding: '32px', // Match the header side padding
    background: 'rgb(250, 249, 246)', // Your body background
  },
};

// Updated styles for horizontal NavLinks
const navLinkStyle = ({ isActive }) => ({
  padding: '8px 16px',
  textDecoration: 'none',
  fontFamily: "'Poppins', sans-serif",
  borderRadius: '8px',
  transition: 'all 0.2s ease-in-out',
  
  // Inactive state
  color: 'rgba(204, 197, 185, 1)', // Your --neutral-color
  background: 'transparent',
  fontWeight: '400',

  // Active state
  ...(isActive && {
    color: '#ffffff',
    background: 'rgb(235, 95, 40)', // Your --secondary-color
    fontWeight: '600',
  }),
});

export default function AdminLayout() {
  return (
    <div style={styles.layout}>
      {/* --- TOP NAVIGATION HEADER --- */}
      <header style={styles.header}>
        <h2 style={styles.headerTitle}>Admin Panel</h2>
        
        <nav>
          <ul style={styles.headerNav}>
            <li>
              <NavLink to="/" style={navLinkStyle}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin" style={navLinkStyle} end>
                Catalog Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users" style={navLinkStyle}>
                User Management
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/bookings" style={navLinkStyle}>
                Booking Management
              </NavLink>
            </li>
            <li>
            <NavLink to="/admin/analytics" style={navLinkStyle}>
                Analytics
            </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}