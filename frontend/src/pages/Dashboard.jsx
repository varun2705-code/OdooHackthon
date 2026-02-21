import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Activity, PackageCheck, AlertTriangle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        onTrip: 0,
        inShop: 0,
        total: 0,
        available: 0
    });

    const [recentTrips, setRecentTrips] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, tripsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/vehicles/stats'),
                axios.get('http://localhost:5000/api/trips')
            ]);
            setStats(statsRes.data);
            setRecentTrips(tripsRes.data.slice(-5).reverse()); // Get most recent 5
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    const kpiCards = [
        { title: 'Active Fleet', value: stats.onTrip, icon: <Truck />, color: 'var(--status-info)' },
        { title: 'Available Vehicles', value: stats.available, icon: <PackageCheck />, color: 'var(--status-success)' },
        { title: 'Maintenance Alerts', value: stats.inShop, icon: <AlertTriangle />, color: 'var(--status-warning)' },
        { title: 'Utilization Rate', value: stats.total > 0 ? Math.round((stats.onTrip / stats.total) * 100) + '%' : '0%', icon: <Activity />, color: 'var(--accent-primary)' },
    ];

    return (
        <div className="dashboard-container">
            <div className="kpi-grid">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="kpi-card glass-panel">
                        <div className="kpi-icon" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                            {kpi.icon}
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-title">{kpi.title}</span>
                            <span className="kpi-value">{kpi.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content">
                <div className="dashboard-section glass-panel">
                    <h3>Recent Trips</h3>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Vehicle ID</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Cargo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTrips.map(trip => (
                                    <tr key={trip._id}>
                                        <td>{trip.vehicleId?.licensePlate || 'N/A'}</td>
                                        <td>{trip.driverId?.name || 'N/A'}</td>
                                        <td>
                                            <span className={`status-pill ${trip.status === 'Completed' ? 'success' : trip.status === 'Dispatched' ? 'info' : 'warning'}`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                        <td>{trip.cargoWeight} kg</td>
                                    </tr>
                                ))}
                                {recentTrips.length === 0 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>No recent trips</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section glass-panel">
                    <h3>Fleet Status Overview</h3>
                    <div className="chart-placeholder">
                        <div className="status-bar-container">
                            <div className="status-labels">
                                <span>Available ({stats.available})</span>
                                <span>On Trip ({stats.onTrip})</span>
                                <span>In Shop ({stats.inShop})</span>
                            </div>
                            <div className="status-bar">
                                <div className="bg-success" style={{ width: `${stats.total > 0 ? (stats.available / stats.total) * 100 : 0}%` }}></div>
                                <div className="bg-info" style={{ width: `${stats.total > 0 ? (stats.onTrip / stats.total) * 100 : 0}%` }}></div>
                                <div className="bg-warning" style={{ width: `${stats.total > 0 ? (stats.inShop / stats.total) * 100 : 0}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
