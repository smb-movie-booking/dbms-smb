import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../utils/axios';
import toast from 'react-hot-toast';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// --- (1) STYLES (Slightly adjusted) ---

const styles = {
    container: {
        fontFamily: "'Poppins', sans-serif"
    },
    title: {
        fontFamily: "'Poppins', sans-serif",
        color: '#363431', // --accent-color
        marginBottom: '24px'
    },
    kpiGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px', // Add space before charts
    },
    kpiCard: {
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        borderLeft: '5px solid rgb(235, 95, 40)',
    },
    kpiLabel: {
        fontSize: '14px',
        color: '#555',
        marginBottom: '8px',
        display: 'block',
    },
    kpiValue: {
        fontSize: '28px',
        fontWeight: '600',
        color: '#363431',
    },
    kpiSubValue: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
        marginTop: '4px',
    },
    chartContainer: { // New style for chart wrappers
        background: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },
    chartTitle: { // New style for chart titles
        fontFamily: "'Poppins', sans-serif",
        color: '#363431',
        marginTop: 0,
        marginBottom: '15px',
        fontSize: '18px',
        fontWeight: '600',
    },
    dateFilter: { // New style for date filters
        marginBottom: '20px',
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
    },
    dateInput: {
         fontFamily: "'Poppins', sans-serif",
         padding: '8px 12px',
         fontSize: '14px',
         border: '1px solid #ccc',
         borderRadius: '6px',
    }
};

// --- (2) ANALYTICS DASHBOARD PAGE ---

export default function AnalyticsDashboard() {
    const [kpis, setKpis] = useState(null);
    const [loadingKpis, setLoadingKpis] = useState(true);

    // State for chart data
    const [revenueOverTimeData, setRevenueOverTimeData] = useState(null);
    const [movieRevenueData, setMovieRevenueData] = useState(null);
    const [theaterRevenueData, setTheaterRevenueData] = useState(null);
    const [loadingCharts, setLoadingCharts] = useState(false);

    // State for date filters
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // Default to 30 days ago
        return date.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]); // Default to today

    const cacheBustConfig = {
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    };

    // Fetch KPIs on initial load
    useEffect(() => {
        const fetchKPIs = async () => {
            setLoadingKpis(true);
            try {
                const res = await axiosInstance.get('/api/admin/analytics/kpis', cacheBustConfig);
                setKpis(res.data.kpis);
            } catch (err) { toast.error("Failed to load dashboard KPIs."); console.error(err); }
            setLoadingKpis(false);
        };
        fetchKPIs();
    }, []);

    // Fetch Chart Data based on date range
    const fetchChartData = async () => {
        setLoadingCharts(true);
        const params = new URLSearchParams({ startDate, endDate }).toString();
        try {
            const [revTimeRes, revMovieRes, revTheaterRes] = await Promise.all([
                axiosInstance.get(`/api/admin/analytics/revenue-over-time?${params}`, cacheBustConfig),
                axiosInstance.get(`/api/admin/analytics/revenue-by-movie?${params}`, cacheBustConfig),
                axiosInstance.get(`/api/admin/analytics/revenue-by-theater?${params}`, cacheBustConfig),
            ]);
            setRevenueOverTimeData(revTimeRes.data.revenueData);
            setMovieRevenueData(revMovieRes.data.movieRevenue);
            setTheaterRevenueData(revTheaterRes.data.theaterRevenue);
        } catch (err) {
            toast.error("Failed to load detailed reports.");
            console.error(err);
        }
        setLoadingCharts(false);
    };

    // Fetch chart data when dates change
    useEffect(() => {
        fetchChartData();
    }, [startDate, endDate]);

    // Helper to format currency
    const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Chart.js data formatting
    const lineChartData = {
        labels: revenueOverTimeData?.map(d => new Date(d.date).toLocaleDateString()) || [],
        datasets: [{
            label: 'Daily Revenue',
            data: revenueOverTimeData?.map(d => d.dailyRevenue) || [],
            borderColor: 'rgb(235, 95, 40)',
            backgroundColor: 'rgba(235, 95, 40, 0.5)',
            tension: 0.1
        }]
    };

    const movieChartData = {
        labels: movieRevenueData?.map(d => d.Title) || [],
        datasets: [{
            label: 'Total Revenue',
            data: movieRevenueData?.map(d => d.totalRevenue) || [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue bars
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };
    
    const theaterChartData = {
        labels: theaterRevenueData?.map(d => d.Cinema_Name) || [],
        datasets: [{
            label: 'Total Revenue',
            data: theaterRevenueData?.map(d => d.totalRevenue) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)', // Green bars
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    
    const chartOptions = { // Common options
        responsive: true,
        plugins: { legend: { display: false } } // Hide legend for simplicity
    };


    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Dashboard Overview</h1>

            {/* --- KPI Section --- */}
            {loadingKpis ? <p>Loading KPIs...</p> : kpis ? (
                <div style={styles.kpiGrid}>
                    {/* Revenue Cards */}
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Revenue Today</span><div style={styles.kpiValue}>{formatCurrency(kpis.revenueToday)}</div></div>
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Revenue This Week</span><div style={styles.kpiValue}>{formatCurrency(kpis.revenueWeek)}</div></div>
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Revenue This Month</span><div style={styles.kpiValue}>{formatCurrency(kpis.revenueMonth)}</div></div>
                    {/* Booking/Occupancy Cards */}
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Bookings Today</span><div style={styles.kpiValue}>{kpis.bookingsToday}</div></div>
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Avg. Occupancy (7d)</span><div style={styles.kpiValue}>{typeof kpis.averageOccupancy === 'number' ? kpis.averageOccupancy.toFixed(1) : '0.0'}%</div></div>
                    {/* Top Performers Cards */}
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Top Movie (Wk)</span><div style={styles.kpiSubValue}>{kpis.topMovieWeek.Title}</div><div style={styles.kpiValue}>{formatCurrency(kpis.topMovieWeek.totalRevenue)}</div></div>
                    <div style={styles.kpiCard}><span style={styles.kpiLabel}>Top Theater (Wk)</span><div style={styles.kpiSubValue}>{kpis.topTheaterWeek.Cinema_Name}</div><div style={styles.kpiValue}>{formatCurrency(kpis.topTheaterWeek.totalRevenue)}</div></div>
                </div>
            ) : <p>Could not load KPIs.</p>}

            {/* --- Detailed Reports Section --- */}
            <h2 style={{...styles.title, fontSize: '22px'}}>Detailed Reports</h2>

            {/* Date Filters */}
            <div style={styles.dateFilter}>
                 <label>Start Date:</label>
                 <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={styles.dateInput} />
                 <label>End Date:</label>
                 <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={styles.dateInput} />
            </div>

            {loadingCharts ? <p>Loading reports...</p> : (
                <>
                    {/* Revenue Over Time Chart */}
                    <div style={styles.chartContainer}>
                        <h3 style={styles.chartTitle}>Revenue Over Time</h3>
                        {revenueOverTimeData && revenueOverTimeData.length > 0 ? (
                            <Line options={chartOptions} data={lineChartData} />
                        ) : <p>No revenue data for selected period.</p>}
                    </div>

                    {/* Revenue By Movie Chart */}
                    <div style={styles.chartContainer}>
                         <h3 style={styles.chartTitle}>Revenue By Movie (Top 15)</h3>
                         {movieRevenueData && movieRevenueData.length > 0 ? (
                             <Bar options={chartOptions} data={movieChartData} />
                         ) : <p>No movie revenue data for selected period.</p>}
                    </div>
                    
                    {/* Revenue By Theater Chart */}
                    <div style={styles.chartContainer}>
                         <h3 style={styles.chartTitle}>Revenue By Theater (Top 15)</h3>
                         {theaterRevenueData && theaterRevenueData.length > 0 ? (
                             <Bar options={{...chartOptions, indexAxis: 'y' }} data={theaterChartData} /> // Horizontal bars
                         ) : <p>No theater revenue data for selected period.</p>}
                    </div>
                </>
            )}
        </div>
    );
}