import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Archive, Activity, Edit2, MoreVertical, Trash2, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', status: '', type: '', sort: '' });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [editingVehicleId, setEditingVehicleId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: ''
    });

    useEffect(() => {
        fetchVehicles();
    }, [filters.status, filters.type]);

    const fetchVehicles = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : filters.search;
            const res = await axios.get('http://localhost:5000/api/vehicles', {
                params: {
                    search: currentSearch,
                    status: filters.status,
                    type: filters.type
                }
            });
            setVehicles(res.data);

            // Client-side fallback filter to ensure UI updates immediately
            let data = res.data;
            if (currentSearch) {
                const s = currentSearch.toLowerCase();
                data = data.filter(v =>
                    v.licensePlate.toLowerCase().includes(s) ||
                    v.name.toLowerCase().includes(s)
                );
            }

            applyLocalSort(data, filters.sort);
        } catch (err) {
            console.error(err);
        }
    };

    const applyLocalSort = (data, sortType) => {
        let sorted = [...data];
        if (sortType === 'name_asc') sorted.sort((a, b) => a.name.localeCompare(b.name));
        else if (sortType === 'name_desc') sorted.sort((a, b) => b.name.localeCompare(a.name));
        else if (sortType === 'newest') sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        else if (sortType === 'oldest') sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setFilteredVehicles(sorted);
    };

    const handleSort = (sortType) => {
        setFilters(prev => ({ ...prev, sort: sortType }));
        applyLocalSort(vehicles, sortType);
    };

    const handleSearchTrigger = (val) => {
        setFilters(prev => ({ ...prev, search: val }));
        fetchVehicles(val);
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
        <div className="vehicle-registry-page">
            <PageHeader
                title="Vehicle Registry"
                subtitle="Manage and track your entire fleet of vehicles, vans, and trucks."
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, status: val }))}
                onSort={handleSort}
            />

            <div className="registry-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => {
                    setShowForm(true);
                    setEditingVehicleId(null);
                    setFormData({ name: '', model: '', licensePlate: '', maxLoadCapacity: '', type: 'Van', acquisitionCost: '' });
                }}>
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
                        {filteredVehicles.map((v) => (
                            <tr key={v._id} style={{ opacity: v.status === 'Retired' ? 0.6 : 1 }}>
                                <td style={{ fontWeight: '500' }}>{v.licensePlate}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span>{v.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.type}</span>
                                    </div>
                                </td>
                                <td>{v.maxLoadCapacity} kg</td>
                                <td>{v.odometer?.toLocaleString() || 0} km</td>
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
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openDropdown === v._id && (
                                                <div className="dropdown-menu glass-panel" style={{
                                                    position: 'absolute',
                                                    right: '0',
                                                    top: '100%',
                                                    padding: '0.5rem',
                                                    zIndex: 10,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    minWidth: '120px'
                                                }}>
                                                    <button
                                                        onClick={() => handleEdit(v)}
                                                        className="btn-secondary"
                                                        style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
                                                    >
                                                        <Edit2 size={14} /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteConfirmId(v._id); setOpenDropdown(null); }}
                                                        className="btn-danger"
                                                        style={{ justifyContent: 'flex-start', border: 'none', background: 'transparent' }}
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
                        {filteredVehicles.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No vehicles found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="custom-modal-overlay" onClick={() => setShowForm(false)}>
                    <form
                        onSubmit={handleSubmit}
                        className="glass-panel modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1rem', color: 'var(--text-primary)', textAlign: 'center' }}>
                            {editingVehicleId ? 'Update Vehicle Asset' : 'Register New Vehicle'}
                        </h3>

                        <div className="form-group">
                            <label>Name/Model</label>
                            <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required placeholder="e.g. Ford Transit" />
                        </div>
                        <div className="form-group">
                            <label>License Plate</label>
                            <input type="text" name="licensePlate" className="form-control" value={formData.licensePlate} onChange={handleChange} required placeholder="ABC-1234" />
                        </div>
                        <div className="form-group">
                            <label>Max Load Capacity (kg)</label>
                            <input type="number" name="maxLoadCapacity" className="form-control" value={formData.maxLoadCapacity} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Vehicle Type</label>
                            <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                                <option value="Van">Van</option>
                                <option value="Truck">Truck</option>
                                <option value="Bike">Bike</option>
                            </select>
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Acquisition Cost ($)</label>
                            <input type="number" name="acquisitionCost" className="form-control" value={formData.acquisitionCost} onChange={handleChange} placeholder="0.00" />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingVehicleId ? 'Update Asset' : 'Save Asset'}</button>
                        </div>
                    </form>
                </div>
            )}

            {deleteConfirmId && (
                <div className="custom-modal-overlay" onClick={() => setDeleteConfirmId(null)}>
                    <div className="glass-panel" style={{ padding: '2rem', width: '400px', maxWidth: '90%', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Confirm Deletion</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                            Are you sure you want to permanently delete this vehicle? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeleteConfirmId(null)}>Cancel</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmDelete}>Permanently Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleRegistry;
