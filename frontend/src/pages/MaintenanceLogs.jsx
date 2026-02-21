import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Wrench, Calendar } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const MaintenanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', type: '', sort: '' });

    const [formData, setFormData] = useState({
        vehicleId: '', description: '', cost: '', type: 'Preventative'
    });

    useEffect(() => {
        fetchData();
    }, [filters.type]);

    const fetchData = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : filters.search;
            const [logsRes, vehiclesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/maintenance', {
                    params: { search: currentSearch, type: filters.type }
                }),
                axios.get('http://localhost:5000/api/vehicles')
            ]);

            let data = logsRes.data;
            if (currentSearch) {
                const s = currentSearch.toLowerCase();
                data = data.filter(log =>
                    (log.description && log.description.toLowerCase().includes(s)) ||
                    (log.vehicleId && log.vehicleId.licensePlate.toLowerCase().includes(s)) ||
                    (log.type && log.type.toLowerCase().includes(s))
                );
            }

            setLogs(data);
            applyLocalSort(data, filters.sort);
            setVehicles(vehiclesRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const applyLocalSort = (data, sortType) => {
        let sorted = [...data];
        if (sortType === 'newest') sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (sortType === 'oldest') sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        setFilteredLogs(sorted);
    };

    const handleSort = (sortType) => {
        setFilters(prev => ({ ...prev, sort: sortType }));
        applyLocalSort(logs, sortType);
    };

    const handleSearchTrigger = (val) => {
        setFilters(prev => ({ ...prev, search: val }));
        fetchData(val);
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
        <div className="maintenance-logs-page">
            <PageHeader
                title="Service & Maintenance"
                subtitle="Logging maintenance automatically sets the vehicle status to 'In Shop'"
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, type: val }))}
                onSort={handleSort}
            />

            <div className="maintenance-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Log Maintenance'}
                </button>
            </div>

            {showForm && (
                <div className="form-container no-print" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                </div>
            )}

            <div className="logs-catalog glass-panel" style={{ padding: '1.5rem' }}>
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
                            {filteredLogs.map((log) => (
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
                            {filteredLogs.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No maintenance logs found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceLogs;
