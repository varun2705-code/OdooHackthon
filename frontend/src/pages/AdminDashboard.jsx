import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // Let's make a modern premium CSS file

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        vehicles: 0,
        drivers: 0,
        trips: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch basic stats from existing arrays/endpoints if possible, or mock them if counting isn't directly supported without writing new backend endpoints.
        // For today's hackathon context, we'll try to fetch all resources and count, but robust apps would have a /api/stats endpoint.
        const fetchStats = async () => {
            try {
                const endpoints = [
                    axios.get('http://localhost:5000/api/users'),
                    axios.get('http://localhost:5000/api/vehicles'),
                    axios.get('http://localhost:5000/api/drivers'),
                    axios.get('http://localhost:5000/api/trips')
                ];

                const [usersRes, vehiclesRes, driversRes, tripsRes] = await Promise.all(endpoints);

                setStats({
                    users: usersRes.data.length,
                    vehicles: vehiclesRes.data.length,
                    drivers: driversRes.data.length,
                    trips: tripsRes.data.length
                });
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.users, link: '/admin/users', icon: '👤', color: 'blue-card' },
        { title: 'Total Vehicles', value: stats.vehicles, link: '/vehicles', icon: '🚚', color: 'green-card' },
        { title: 'Active Drivers', value: stats.drivers, link: '/drivers', icon: '👨‍✈️', color: 'purple-card' },
        { title: 'Total Trips', value: stats.trips, link: '/dispatch', icon: '🛣️', color: 'orange-card' }
    ];

    return (
        <div className="admin-dashboard fade-in">
            <header className="admin-header">
                <h1>Admin Control Center</h1>
                <p>Welcome back, Administrator. Here's what's happening today.</p>
            </header>

            {loading ? (
                <div className="loader">Loading stats...</div>
            ) : (
                <div className="stats-grid">
                    {cards.map((card, idx) => (
                        <div key={idx} className={`stat-card ${card.color}`}>
                            <div className="stat-content">
                                <span className="stat-icon">{card.icon}</span>
                                <div className="stat-details">
                                    <h3>{card.title}</h3>
                                    <p className="stat-value">{card.value}</p>
                                </div>
                            </div>
                            <Link to={card.link} className="stat-link">
                                Manage <span className="arrow">→</span>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <div className="admin-quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-flex">
                    <Link to="/admin/users" className="btn btn-primary glass-btn">
                        <span className="icon">➕</span> Add New User
                    </Link>
                    <Link to="/vehicles" className="btn btn-secondary glass-btn">
                        <span className="icon">🚚</span> Register Vehicle
                    </Link>
                    <Link to="/dispatch" className="btn btn-tertiary glass-btn">
                        <span className="icon">⚡</span> Dispatch Trip
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
