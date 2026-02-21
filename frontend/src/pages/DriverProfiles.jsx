import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ShieldCheck, ShieldAlert, UserX, UserCheck } from 'lucide-react';

const DriverProfiles = () => {
    const [drivers, setDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', licenseCategory: 'Van', licenseExpiry: '', safetyScore: 100
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/drivers');
            setDrivers(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/drivers', formData);
            setShowForm(false);
            setFormData({ name: '', licenseCategory: 'Van', licenseExpiry: '', safetyScore: 100 });
            fetchDrivers();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Suspended' ? 'Off Duty' : currentStatus === 'Off Duty' ? 'On Duty' : 'Suspended';
        try {
            await axios.put(`http://localhost:5000/api/drivers/${id}`, { status: newStatus });
            fetchDrivers();
        } catch (err) {
            console.error(err);
        }
    };

    const isLicenseExpired = (expiryDate) => {
        return new Date(expiryDate) < new Date();
    };

    return (
        <div className="page-container" style={{ position: 'relative', width: '100%' }}>
            {/* Header and Background Content */}
            <div style={{ filter: showForm ? 'blur(8px)' : 'none', transition: 'filter 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '3rem', textAlign: 'center' }}>
                    <div>
                        <h2>Driver Profiles & Safety</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Monitor compliance, licenses, and performance</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ padding: '0.75rem 2rem' }}>
                        <Plus size={18} />
                        Add Driver
                    </button>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Driver Info</th>
                                <th>License & Category</th>
                                <th>Safety Score</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver) => {
                                const expired = isLicenseExpired(driver.licenseExpiry);
                                return (
                                    <tr key={driver._id} style={{ opacity: driver.status === 'Suspended' ? 0.6 : 1 }}>
                                        <td style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                                                {driver.name.charAt(0)}
                                            </div>
                                            {driver.name}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span>Class {driver.licenseCategory}</span>
                                                <span style={{ fontSize: '0.75rem', color: expired ? 'var(--status-danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    {expired ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                                    Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    color: driver.safetyScore >= 90 ? 'var(--status-success)' : driver.safetyScore >= 70 ? 'var(--status-warning)' : 'var(--status-danger)',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {driver.safetyScore}/100
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`status-pill ${driver.status === 'On Duty' ? 'success' : driver.status === 'Off Duty' ? 'warning' : 'danger'}`}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="icon-btn"
                                                onClick={() => toggleStatus(driver._id, driver.status)}
                                                title="Toggle Status (Suspended/Off Duty/On Duty)"
                                            >
                                                {driver.status === 'Suspended' ? <UserCheck size={18} style={{ color: 'var(--status-success)' }} /> : <UserX size={18} style={{ color: 'var(--status-danger)' }} />}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {drivers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No drivers registered. Click "Add Driver" to start.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {showForm && (
                <div className="custom-modal-overlay" onClick={() => setShowForm(false)}>
                    <form
                        onSubmit={handleSubmit}
                        className="glass-panel modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1.5rem', textAlign: 'center' }}>Register New Driver</h3>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required placeholder="John Doe" />
                        </div>
                        <div className="form-group">
                            <label>License Category</label>
                            <select name="licenseCategory" className="form-control" onChange={handleChange}>
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>License Expiry Date</label>
                            <input type="date" name="licenseExpiry" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Safety Score (0-100)</label>
                            <input type="number" name="safetyScore" className="form-control" min="0" max="100" defaultValue="100" onChange={handleChange} />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Profile</button>
                        </div>
                    </form>
                </div>
            )}

            <style>{`
                @keyframes modalFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default DriverProfiles;
