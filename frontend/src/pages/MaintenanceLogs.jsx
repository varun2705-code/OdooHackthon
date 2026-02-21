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
<<<<<<< HEAD
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
=======
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b

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
<<<<<<< HEAD
        setLoading(true);
        setError(null);
        try {
            // Ensure cost is a number
            const submissionData = {
                ...formData,
                cost: Number(formData.cost)
            };
            await axios.post('http://localhost:5000/api/maintenance', submissionData);
=======
        try {
            await axios.post('http://localhost:5000/api/maintenance', formData);
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
            setShowForm(false);
            setFormData({ vehicleId: '', description: '', cost: '', type: 'Preventative' });
            fetchData();
        } catch (err) {
<<<<<<< HEAD
            console.error('Error logging maintenance:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to log maintenance. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async (logId) => {
        try {
            await axios.put(`http://localhost:5000/api/maintenance/${logId}/complete`);
            fetchData();
        } catch (err) {
            console.error('Error completing maintenance:', err);
            alert('Failed to complete maintenance.');
=======
            console.error(err);
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
        }
    };

    return (
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="page-container" style={{ position: 'relative', width: '100%' }}>
            {/* Header and Background Content */}
            <div style={{ filter: showForm ? 'blur(8px)' : 'none', transition: 'filter 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '3rem', textAlign: 'center' }}>
                    <div>
                        <h2>Service & Maintenance</h2>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Logging maintenance automatically sets the vehicle status to "In Shop"</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ padding: '0.75rem 2rem' }}>
                        <Plus size={18} />
                        Log Maintenance
                    </button>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Vehicle</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Cost</th>
                                <th>Status</th>
                                <th>Action</th>
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
                                    <td style={{ fontWeight: '500' }}>{log.vehicleId?.licensePlate || 'N/A'}</td>
                                    <td>
                                        <span className={`status-pill ${log.type === 'Preventative' ? 'info' : 'danger'}`}>
                                            {log.type}
                                        </span>
                                    </td>
                                    <td>{log.description}</td>
                                    <td style={{ color: 'var(--status-warning)', fontWeight: '600' }}>
                                        ${typeof log.cost === 'number' ? log.cost.toLocaleString() : log.cost}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${log.completed ? 'success' : 'warning'}`}>
                                            {log.completed ? 'Service Complete' : 'In Progress'}
                                        </span>
                                    </td>
                                    <td>
                                        {!log.completed && (
                                            <button
                                                className="btn btn-primary"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', width: 'auto' }}
                                                onClick={() => handleComplete(log._id)}
                                            >
                                                Return to Service
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No maintenance logs found. Click "Log Maintenance" to add one.</td>
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
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1rem', color: 'var(--text-primary)', textAlign: 'center' }}>Log Maintenance Activity</h3>

                        {error && (
                            <div style={{
                                gridColumn: 'span 2',
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--status-danger)',
                                borderRadius: '8px',
                                color: 'var(--status-danger)',
                                fontSize: '0.875rem',
                                marginBottom: '0.5rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Select Vehicle</label>
                            <select name="vehicleId" className="form-control" onChange={handleChange} required>
                                <option value="">-- Choose Vehicle --</option>
                                {vehicles
                                    .filter(v => v.status !== 'In Shop')
                                    .map(v => (
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

                        <div className="form-group">
                            <label>Total Cost ($)</label>
                            <input type="number" name="cost" className="form-control" onChange={handleChange} required placeholder="0.00" />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Description</label>
                            <input type="text" name="description" className="form-control" onChange={handleChange} required placeholder="e.g. Oil Change, Tire Replacement" />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn btn-warning" style={{ flex: 1 }} disabled={loading}>
                                <Wrench size={16} style={{ marginRight: '8px' }} />
                                {loading ? 'Sending to Shop...' : 'Send to Shop'}
                            </button>
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
=======
        <div className="page-container glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Service & Maintenance</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Logging maintenance automatically sets the vehicle status to "In Shop"</p>
                </div>
=======
        <div className="maintenance-logs-page">
            <PageHeader
                title="Service & Maintenance"
                subtitle="Logging maintenance automatically sets the vehicle status to 'In Shop'"
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, type: val }))}
                onSort={handleSort}
            />

            <div className="maintenance-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
>>>>>>> feature
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
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
        </div>
    );
};

export default MaintenanceLogs;
