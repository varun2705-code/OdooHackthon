import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Archive, Activity } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const VehicleRegistry = () => {
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', status: '', type: '', sort: '' });

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
        <div className="vehicle-registry-page">
            <PageHeader
                title="Vehicle Registry"
                subtitle="Manage and track your entire fleet of vehicles, vans, and trucks."
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, status: val }))}
                onSort={handleSort}
            />

            <div className="registry-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add Vehicle'}
                </button>
            </div>

            {showForm && (
                <div className="form-container no-print" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Name/Model</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>License Plate (Unique)</label>
                            <input type="text" name="licensePlate" className="form-control" onChange={handleChange} required />
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
                            <input type="number" name="acquisitionCost" className="form-control" onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Asset</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="catalog-container glass-panel" style={{ padding: '1.5rem' }}>
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
                            {filteredVehicles.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No vehicles found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VehicleRegistry;
