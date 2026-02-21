import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Activity, PackageCheck, AlertTriangle, Calendar, User } from 'lucide-react';
import './Dashboard.css';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
    const [stats, setStats] = useState({
        onTrip: 0,
        inShop: 0,
        total: 0,
        available: 0
    });
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStats();
        fetchTrips();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchTrips = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : searchTerm;
            const res = await axios.get('http://localhost:5000/api/trips', {
                params: { search: currentSearch }
            });
            setTrips(res.data);
            setFilteredTrips(res.data);
        } catch (err) {
            console.error('Error fetching trips:', err);
        }
    };

    const handleSearch = (val) => {
        setSearchTerm(val);
        fetchTrips(val);
    };

    const kpiCards = [
        { title: 'Active Fleet', value: stats.onTrip, icon: <Truck />, color: 'var(--status-info)' },
        { title: 'Available Vehicles', value: stats.available, icon: <PackageCheck />, color: 'var(--status-success)' },
        { title: 'Maintenance Alerts', value: stats.inShop, icon: <AlertTriangle />, color: 'var(--status-warning)' },
        { title: 'Utilization Rate', value: stats.total > 0 ? Math.round((stats.onTrip / stats.total) * 100) + '%' : '0%', icon: <Activity />, color: 'var(--accent-primary)' },
    ];

    return (
        <div className="dashboard-container">
            <PageHeader
                title="Command Center"
                subtitle="Real-time overview of fleet operations, active trips, and asset utilization."
                onSearch={handleSearch}
            />

            <div className="kpi-grid no-print">
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
                <div className="dashboard-section glass-panel printable-area">
                    <div className="section-header">
                        <h3>Recent Trips</h3>
                        <div className="print-only">
                            <p>Generated on: {new Date().toLocaleString()}</p>
                            <p>Fleet Summary: {stats.total} Total | {stats.onTrip} Active</p>
                        </div>
                    </div>
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Route</th>
                                    <th>Asset</th>
                                    <th>Personnel</th>
                                    <th>Status</th>
                                    <th>Schedule</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTrips.slice(0, 10).map((trip) => (
                                    <tr key={trip._id}>
                                        <td>
                                            <div style={{ fontWeight: '500' }}>{trip.startLocation || 'HQ'} &rarr; {trip.endLocation}</div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Truck size={14} style={{ color: 'var(--text-muted)' }} />
                                                {trip.vehicleId?.licensePlate}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <User size={14} style={{ color: 'var(--text-muted)' }} />
                                                {trip.driverId?.name}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${trip.status === 'Completed' ? 'success' : trip.status === 'Dispatched' ? 'info' : trip.status === 'Draft' ? 'warning' : 'danger'}`}>
                                                {trip.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <Calendar size={12} />
                                                {new Date(trip.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTrips.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No recent trips found matching your search.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="dashboard-section glass-panel no-print">
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
                        <div style={{ marginTop: '2rem' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                Total Fleet Size: <strong>{stats.total} units</strong>
                            </p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                Utilization is currently at {stats.total > 0 ? Math.round((stats.onTrip / stats.total) * 100) : 0}%. Use the dispatch center to assign idle assets.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
