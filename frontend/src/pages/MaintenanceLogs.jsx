import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Wrench, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const MaintenanceLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', type: '', sort: 'newest' });
    const [formData, setFormData] = useState({
        vehicleId: '', description: '', cost: '', type: 'Preventative'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [filters.type]);

    const fetchData = async (searchVal) => {
        setLoading(true);
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
            console.error('Error fetching maintenance data:', err);
            setError('Failed to load maintenance logs.');
        } finally {
            setLoading(false);
        }
    };

    const applyLocalSort = (data, sortType) => {
        let sorted = [...data];
        if (sortType === 'newest') {
            sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortType === 'oldest') {
            sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortType === 'name_asc') {
            sorted.sort((a, b) => (a.vehicleId?.licensePlate || '').localeCompare(b.vehicleId?.licensePlate || ''));
        } else if (sortType === 'name_desc') {
            sorted.sort((a, b) => (b.vehicleId?.licensePlate || '').localeCompare(a.vehicleId?.licensePlate || ''));
        }
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

    const handleGroup = (val) => {
        // Map PageHeader group values to filter logic
        if (val === 'Preventative' || val === 'Reactive') {
            setFilters(prev => ({ ...prev, type: val }));
        } else if (val === '') {
            setFilters(prev => ({ ...prev, type: '' }));
        }
        // Other groups like 'status' could be handled if the backend supported them
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const submissionData = {
                ...formData,
                cost: Number(formData.cost)
            };
            await axios.post('http://localhost:5000/api/maintenance', submissionData);
            setShowForm(false);
            setFormData({ vehicleId: '', description: '', cost: '', type: 'Preventative' });
            fetchData();
        } catch (err) {
            console.error('Error logging maintenance:', err);
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to log maintenance.');
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
        }
    };

    const formatCurrency = (val) => {
        return '$' + Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <div className="maintenance-logs-page" style={{ position: 'relative' }}>
            <PageHeader
                title="Service & Maintenance"
                subtitle="Logging maintenance updates vehicle status to 'In Shop' and tracks service history."
                onSearch={handleSearchTrigger}
                onGroup={handleGroup}
                onSort={handleSort}
            />

            <div className="maintenance-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} />
                    Log Maintenance
                </button>
            </div>

            <div className="data-table-container">
                {loading && filteredLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <div className="loading-spinner"></div>
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading logs...</p>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Service Date</th>
                                <th>Vehicle Asset</th>
                                <th>Type</th>
                                <th>Maintenance Details</th>
                                <th>Cost</th>
                                <th>Status</th>
                                <th className="no-print">Actions</th>
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
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '600' }}>{log.vehicleId?.licensePlate || 'Unknown'}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.vehicleId?.model || 'General Fleet'}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-pill ${log.type === 'Preventative' ? 'info' : 'danger'}`}>
                                            {log.type === 'Preventative' ? 'Routine' : 'Repair'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={log.description}>
                                            {log.description}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                        {formatCurrency(log.cost)}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {log.completed ? (
                                                <CheckCircle size={14} style={{ color: 'var(--status-success)' }} />
                                            ) : (
                                                <Clock size={14} style={{ color: 'var(--status-warning)' }} />
                                            )}
                                            <span className={`status-pill ${log.completed ? 'success' : 'warning'}`}>
                                                {log.completed ? 'Completed' : 'Active'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="no-print">
                                        {!log.completed && (
                                            <button
                                                className="btn btn-secondary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: 'auto', border: '1px solid var(--status-success)', color: 'var(--status-success)' }}
                                                onClick={() => handleComplete(log._id)}
                                            >
                                                Complete Service
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredLogs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                                        <AlertTriangle size={32} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                                        <p style={{ color: 'var(--text-secondary)' }}>No maintenance logs found matching your criteria.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showForm && (
                <div className="custom-modal-overlay" onClick={() => setShowForm(false)}>
                    <form
                        onSubmit={handleSubmit}
                        className="glass-panel modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '700px' }}
                    >
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1.5rem', color: 'var(--text-primary)', textAlign: 'center' }}>Log Maintenance Activity</h3>

                        {error && (
                            <div style={{
                                gridColumn: 'span 2',
                                padding: '0.75rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid var(--status-danger)',
                                borderRadius: '8px',
                                color: 'var(--status-danger)',
                                fontSize: '0.875rem',
                                marginBottom: '1rem'
                            }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Select Vehicle</label>
                            <select name="vehicleId" className="form-control" onChange={handleChange} required>
                                <option value="">-- Choose Vehicle --</option>
                                {vehicles
                                    .filter(v => v.status !== 'Retired')
                                    .map(v => (
                                        <option key={v._id} value={v._id}>
                                            {v.licensePlate} ({v.type}) - Current: {v.status}
                                        </option>
                                    ))}
                            </select>
                            <small className="helper-text" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                                Vehicles already 'In Shop' are listed to allow logging multiple service items.
                            </small>
                        </div>

                        <div className="form-group">
                            <label>Service Category</label>
                            <select name="type" className="form-control" onChange={handleChange}>
                                <option value="Preventative">Routine / Preventative</option>
                                <option value="Reactive">Reactive / Repair</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Total Estimated Cost ($)</label>
                            <input type="number" name="cost" className="form-control" onChange={handleChange} required placeholder="0.00" step="0.01" />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label>Service Description</label>
                            <textarea
                                name="description"
                                className="form-control"
                                onChange={handleChange}
                                required
                                placeholder="Detail the work being performed (e.g. 50k mile service, brake pad replacement)..."
                                style={{ minHeight: '80px', resize: 'vertical' }}
                            ></textarea>
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)} disabled={loading}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={loading}>
                                <Wrench size={16} style={{ marginRight: '8px' }} />
                                {loading ? 'Logging Activity...' : 'Log & Send to Shop'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default MaintenanceLogs;
