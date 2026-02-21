import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Archive, Activity, MoreVertical, Trash2, X } from 'lucide-react';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
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
            if (editingVehicleId) {
                await axios.put(`http://localhost:5000/api/vehicles/${editingVehicleId}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/vehicles', formData);
            }
            setShowForm(false);
            setEditingVehicleId(null);
            setFormData({ name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: '' });
            fetchVehicles();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (vehicle) => {
        setFormData({
            name: vehicle.name || '',
            model: vehicle.model || '',
            licensePlate: vehicle.licensePlate || '',
            maxLoadCapacity: vehicle.maxLoadCapacity || '',
            type: vehicle.type || 'Van',
            acquisitionCost: vehicle.acquisitionCost || ''
        });
        setEditingVehicleId(vehicle._id);
        setShowForm(true);
        setOpenDropdown(null);
        window.scrollTo(0, 0);
    };

    const confirmDelete = async () => {
        if (!deleteConfirmId) return;
        try {
            await axios.delete(`http://localhost:5000/api/vehicles/${deleteConfirmId}`);
            setDeleteConfirmId(null);
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
        <div className="page-container glass-panel" style={{ padding: '1.5rem', minHeight: '80vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Vehicle Registry</h2>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(!showForm);
                    if (!showForm) {
                        setEditingVehicleId(null);
                        setFormData({ name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: '' });
                    }
                }}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add Vehicle'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                        <label>Name/Model</label>
                        <input type="text" name="name" className="form-control" onChange={handleChange} value={formData.name} required />
                    </div>
                    <div className="form-group">
                        <label>License Plate (Unique)</label>
                        <input type="text" name="licensePlate" className="form-control" onChange={handleChange} value={formData.licensePlate} required />
                    </div>
                    <div className="form-group">
                        <label>Max Load Capacity (kg)</label>
                        <input type="number" name="maxLoadCapacity" className="form-control" onChange={handleChange} value={formData.maxLoadCapacity} required />
                    </div>
                    <div className="form-group">
                        <label>Vehicle Type</label>
                        <select name="type" className="form-control" onChange={handleChange} value={formData.type}>
                            <option value="Van">Van</option>
                            <option value="Truck">Truck</option>
                            <option value="Bike">Bike</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Acquisition Cost ($)</label>
                        <input type="number" name="acquisitionCost" className="form-control" onChange={handleChange} value={formData.acquisitionCost} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {editingVehicleId ? 'Update Asset' : 'Save Asset'}
                        </button>
                    </div>
                </form>
            )}

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
                                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', position: 'relative' }}>
                                        <button
                                            className="icon-btn"
                                            onClick={() => toggleRetired(v._id, v.status)}
                                            title={v.status === 'Retired' ? 'Reactivate' : 'Mark Out of Service'}
                                        >
                                            {v.status === 'Retired' ? <Activity size={18} /> : <Archive size={18} />}
                                        </button>

                                        <div className="dropdown-container">
                                            <button
                                                className="icon-btn"
                                                onClick={() => setOpenDropdown(openDropdown === v._id ? null : v._id)}
                                                onBlur={() => setTimeout(() => setOpenDropdown(null), 200)}
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openDropdown === v._id && (
                                                <div className="dropdown-menu" style={{
                                                    position: 'absolute',
                                                    right: '0',
                                                    top: '100%',
                                                    backgroundColor: 'var(--bg-glass)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    padding: '0.5rem',
                                                    zIndex: 10,
                                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    minWidth: '120px'
                                                }}>
                                                    <button
                                                        onClick={() => handleEdit(v)}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}
                                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteConfirmId(v._id); setOpenDropdown(null); }}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', textAlign: 'left', borderRadius: '4px' }}
                                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                    >
                                                        <Trash2 size={14} /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {vehicles.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No vehicles found. Add one above.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {deleteConfirmId && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 9999,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div className="glass-panel" style={{
                        padding: '2rem',
                        width: '400px',
                        maxWidth: '90%',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setDeleteConfirmId(null)}
                            style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={20} />
                        </button>
                        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Confirm Deletion</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                            Are you sure you want to permanently delete this vehicle? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={confirmDelete}>Confirm</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleRegistry;
