import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Activity, PackageCheck, AlertTriangle } from 'lucide-react';
import './Dashboard.css';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
    const [stats, setStats] = useState({
        onTrip: 0,
        inShop: 0,
        total: 0,
        available: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
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
            <PageHeader
                title="Dashboard"
                subtitle="Real-time overview of your fleet operations and performance metrics."
                onSearch={(val) => console.log('Searching dashboard:', val)}
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
                                    <th>Vehicle ID</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Cargo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>VAN-05</td>
                                    <td>Alex M.</td>
                                    <td><span className="status-pill info">On Trip</span></td>
                                    <td>450 kg</td>
                                </tr>
                                <tr>
                                    <td>TRK-01</td>
                                    <td>Sarah J.</td>
                                    <td><span className="status-pill info">On Trip</span></td>
                                    <td>1200 kg</td>
                                </tr>
                                <tr>
                                    <td>VAN-02</td>
                                    <td>John D.</td>
                                    <td><span className="status-pill success">Available</span></td>
                                    <td>300 kg</td>
                                </tr>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
