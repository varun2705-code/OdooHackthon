import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Wrench, Calendar } from 'lucide-react';

const MaintenanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        vehicleId: '', description: '', cost: '', type: 'Preventative'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [logsRes, vehiclesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/maintenance'),
                axios.get('http://localhost:5000/api/vehicles')
            ]);
            setLogs(logsRes.data);
            setVehicles(vehiclesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/maintenance', formData);
            setShowForm(false);
            setFormData({ vehicleId: '', description: '', cost: '', type: 'Preventative' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page-container glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Service & Maintenance</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Logging maintenance automatically sets the vehicle status to "In Shop"</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Log Maintenance'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Select Vehicle</label>
                        <select name="vehicleId" className="form-control" onChange={handleChange} required>
                            <option value="">-- Choose Vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id}>{v.licensePlate} ({v.status})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Service Type</label>
                        <select name="type" className="form-control" onChange={handleChange}>
                            <option value="Preventative">Preventative Maintenance</option>
                            <option value="Reactive">Reactive / Repair</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <label>Description (e.g., Oil Change, Tire Replacement)</label>
                        <input type="text" name="description" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Total Cost ($)</label>
                        <input type="number" name="cost" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-warning" style={{ width: '100%' }}>
                            <Wrench size={16} style={{ marginRight: '8px' }} /> Send to Shop
                        </button>
                    </div>
                </form>
            )}

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                                        {new Date(log.date).toLocaleDateString()}
                                    </div>
                                </td>
                                <td style={{ fontWeight: '500' }}>{log.vehicleId?.licensePlate}</td>
                                <td>
                                    <span className={`status-pill ${log.type === 'Preventative' ? 'info' : 'danger'}`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td>{log.description}</td>
                                <td style={{ color: 'var(--status-warning)', fontWeight: '600' }}>${log.cost}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No maintenance logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaintenanceLogs;
