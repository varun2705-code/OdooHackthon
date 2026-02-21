import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, ShieldCheck, ShieldAlert, UserX, UserCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const DriverProfiles = () => {
    const [drivers, setDrivers] = useState([]);
    const [filteredDrivers, setFilteredDrivers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', status: '', category: '', sort: '' });

    const [formData, setFormData] = useState({
        name: '', licenseCategory: 'Van', licenseExpiry: '', safetyScore: 100
    });

    useEffect(() => {
        fetchDrivers();
    }, [filters.status, filters.category]);

    const fetchDrivers = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : filters.search;
            const res = await axios.get('http://localhost:5000/api/drivers', {
                params: {
                    search: currentSearch,
                    status: filters.status,
                    category: filters.category
                }
            });
            setDrivers(res.data);

            // Client-side fallback
            let data = res.data;
            if (currentSearch) {
                const s = currentSearch.toLowerCase();
                data = data.filter(d =>
                    d.name.toLowerCase().includes(s) ||
                    d.licenseCategory.toLowerCase().includes(s)
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
        setFilteredDrivers(sorted);
    };

    const handleSort = (sortType) => {
        setFilters(prev => ({ ...prev, sort: sortType }));
        applyLocalSort(drivers, sortType);
    };

    const handleSearchTrigger = (val) => {
        setFilters(prev => ({ ...prev, search: val }));
        fetchDrivers(val);
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
        <div className="driver-profiles-page">
            <PageHeader
                title="Driver Profiles & Safety"
                subtitle="Monitor compliance, active licenses, and operational safety performance."
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, status: val }))}
                onSort={handleSort}
            />

            <div className="driver-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add Driver'}
                </button>
            </div>

            {showForm && (
                <div className="form-container no-print" style={{ marginBottom: '2rem' }}>
                    <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" className="form-control" onChange={handleChange} required />
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
                            <label>Initial Safety Score (0-100)</label>
                            <input type="number" name="safetyScore" className="form-control" min="0" max="100" defaultValue="100" onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ minWidth: '150px' }}>Save Profile</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="drivers-catalog glass-panel" style={{ padding: '1.5rem' }}>
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
                            {filteredDrivers.map((driver) => {
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
                            {filteredDrivers.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No drivers found matching your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DriverProfiles;
