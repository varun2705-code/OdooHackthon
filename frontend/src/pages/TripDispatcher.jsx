import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Send, CheckCircle, XCircle } from 'lucide-react';

const TripDispatcher = () => {
    const [trips, setTrips] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        vehicleId: '', driverId: '', cargoWeight: '', startLocation: '', endLocation: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [tripsRes, vehiclesRes, driversRes] = await Promise.all([
                axios.get('http://localhost:5000/api/trips'),
                axios.get('http://localhost:5000/api/vehicles'),
                axios.get('http://localhost:5000/api/drivers')
            ]);
            setTrips(tripsRes.data);
            setVehicles(vehiclesRes.data);
            setDrivers(driversRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post('http://localhost:5000/api/trips', formData);
            setShowForm(false);
            setFormData({ vehicleId: '', driverId: '', cargoWeight: '', startLocation: '', endLocation: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating trip');
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            // If completed, we would technically prompt for odometer, using simple fixed update for demo
            const payload = { status: newStatus };
            if (newStatus === 'Completed') payload.odometer = 500; // Mock update

            await axios.patch(`http://localhost:5000/api/trips/${id}/status`, payload);
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const availableVehicles = vehicles.filter(v => v.status === 'Available');
    const availableDrivers = drivers.filter(d => d.status === 'On Duty');

    return (
        <div className="page-container glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Trip Dispatcher</h2>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Create Trip'}
                </button>
            </div>

            {error && <div style={{ color: 'var(--status-danger)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            {showForm && (
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Select Vehicle</label>
                        <select name="vehicleId" className="form-control" onChange={handleChange} required>
                            <option value="">-- Choose Vehicle --</option>
                            {availableVehicles.map(v => (
                                <option key={v._id} value={v._id}>{v.licensePlate} ({v.maxLoadCapacity}kg)</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Select Driver</label>
                        <select name="driverId" className="form-control" onChange={handleChange} required>
                            <option value="">-- Choose Driver --</option>
                            {availableDrivers.map(d => (
                                <option key={d._id} value={d._id}>{d.name} ({d.licenseCategory})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Cargo Weight (kg)</label>
                        <input type="number" name="cargoWeight" className="form-control" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Start Location</label>
                        <input type="text" name="startLocation" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>End Location</label>
                        <input type="text" name="endLocation" className="form-control" onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Draft Trip</button>
                    </div>
                </form>
            )}

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Trip Route</th>
                            <th>Vehicle & Load</th>
                            <th>Driver</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.map((t) => (
                            <tr key={t._id}>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontWeight: '500' }}>{t.startLocation || 'HQ'} &rarr;</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t.endLocation || 'Destination'}</span>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{t.vehicleId?.licensePlate}</span>
                                        <span style={{ fontSize: '0.75rem', color: t.cargoWeight > t.vehicleId?.maxLoadCapacity ? 'var(--status-danger)' : 'var(--text-muted)' }}>
                                            {t.cargoWeight}kg / {t.vehicleId?.maxLoadCapacity}kg
                                        </span>
                                    </div>
                                </td>
                                <td>{t.driverId?.name}</td>
                                <td>
                                    <span className={`status-pill ${t.status === 'Completed' ? 'success' : t.status === 'Dispatched' ? 'info' : t.status === 'Cancelled' ? 'danger' : 'warning'}`}>
                                        {t.status}
                                    </span>
                                </td>
                                <td>
                                    {t.status === 'Draft' && (
                                        <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem' }} onClick={() => updateStatus(t._id, 'Dispatched')}>
                                            <Send size={14} /> Dispatch
                                        </button>
                                    )}
                                    {t.status === 'Dispatched' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="icon-btn" style={{ color: 'var(--status-success)' }} onClick={() => updateStatus(t._id, 'Completed')} title="Complete">
                                                <CheckCircle size={18} />
                                            </button>
                                            <button className="icon-btn" style={{ color: 'var(--status-danger)' }} onClick={() => updateStatus(t._id, 'Cancelled')} title="Cancel">
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {trips.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No trips found. Create one above.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TripDispatcher;
