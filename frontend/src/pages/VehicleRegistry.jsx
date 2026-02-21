import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Archive, Activity } from 'lucide-react';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: ''
    });

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/vehicles');
            setVehicles(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/vehicles', formData);
            setShowForm(false);
            setFormData({ name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: '' });
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleRetired = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Retired' ? 'Available' : 'Retired';
        try {
            await axios.put(`http://localhost:5000/api/vehicles/${id}`, { status: newStatus });
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Available': return 'success';
            case 'On Trip': return 'info';
            case 'In Shop': return 'warning';
            case 'Retired': return 'danger';
            default: return '';
        }
    };

    return (
        <div className="page-container" style={{ position: 'relative', width: '100%' }}>
            {/* Header and Background Content */}
            <div style={{ filter: showForm ? 'blur(8px)' : 'none', transition: 'filter 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '3rem', textAlign: 'center' }}>
                    <div>
                        <h2>Vehicle Assets & Registry</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage fleet inventory, specifications, and total cost of ownership</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ padding: '0.75rem 2rem' }}>
                        <Plus size={18} />
                        Add Vehicle
                    </button>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID/Plate</th>
                                <th>Name & Type</th>
                                <th>Capacity</th>
                                <th>Odometer</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((v) => (
                                <tr key={v._id} style={{ opacity: v.status === 'Retired' ? 0.6 : 1 }}>
                                    <td style={{ fontWeight: '500' }}>{v.licensePlate}</td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span>{v.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.type}</span>
                                        </div>
                                    </td>
                                    <td>{v.maxLoadCapacity} kg</td>
                                    <td>{v.odometer.toLocaleString()} km</td>
                                    <td><span className={`status-pill ${getStatusClass(v.status)}`}>{v.status}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="icon-btn"
                                                onClick={() => toggleRetired(v._id, v.status)}
                                                title={v.status === 'Retired' ? 'Reactivate' : 'Mark Out of Service'}
                                            >
                                                {v.status === 'Retired' ? <Activity size={18} /> : <Archive size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {vehicles.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No vehicles found. Click "Add Vehicle" to register one.</td>
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
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1rem', color: 'var(--text-primary)', textAlign: 'center' }}>Register New Vehicle</h3>

                        <div className="form-group">
                            <label>Name/Model</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required placeholder="e.g. Ford Transit" />
                        </div>
                        <div className="form-group">
                            <label>License Plate</label>
                            <input type="text" name="licensePlate" className="form-control" onChange={handleChange} required placeholder="ABC-1234" />
                        </div>
                        <div className="form-group">
                            <label>Max Load Capacity (kg)</label>
                            <input type="number" name="maxLoadCapacity" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select name="type" className="form-control" onChange={handleChange}>
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Acquisition Cost ($)</label>
                            <input type="number" name="acquisitionCost" className="form-control" onChange={handleChange} placeholder="0.00" />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Asset</button>
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

export default VehicleRegistry;
