import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, DollarSign, Fuel } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const ExpenseLogs = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', type: '', sort: '' });

    const [formData, setFormData] = useState({
        vehicleId: '', type: 'Fuel', liters: '', cost: ''
    });

    useEffect(() => {
        fetchData();
    }, [filters.type]);

    const fetchData = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : filters.search;
            const [expRes, vehRes] = await Promise.all([
                axios.get('http://localhost:5000/api/expenses', {
                    params: { search: currentSearch, type: filters.type }
                }),
                axios.get('http://localhost:5000/api/vehicles')
            ]);
            setExpenses(expRes.data);
            applyLocalSort(expRes.data, filters.sort);
            setVehicles(vehRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    const applyLocalSort = (data, sortType) => {
        let sorted = [...data];
        if (sortType === 'newest') sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (sortType === 'oldest') sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        setFilteredExpenses(sorted);
    };

    const handleSort = (sortType) => {
        setFilters(prev => ({ ...prev, sort: sortType }));
        applyLocalSort(expenses, sortType);
    };

    const handleSearchTrigger = (val) => {
        setFilters(prev => ({ ...prev, search: val }));
        fetchData(val);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/expenses', formData);
            setShowForm(false);
            setFormData({ vehicleId: '', type: 'Fuel', liters: '', cost: '' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="expense-logs-page">
            <PageHeader
                title="Operational Expenses"
                subtitle="Track fuel, tolls, and other trip-related costs"
                onSearch={handleSearchTrigger}
                onGroup={(val) => setFilters(prev => ({ ...prev, type: val }))}
                onSort={handleSort}
            />

            <div className="expense-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <Plus size={18} />
                    Log Expense
                </button>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Vehicle</th>
                            <th>Expense Type</th>
                            <th>Details</th>
                            <th>Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp) => (
                            <tr key={exp._id}>
                                <td>{new Date(exp.date).toLocaleDateString()}</td>
                                <td style={{ fontWeight: '500' }}>{exp.vehicleId?.licensePlate}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {exp.type === 'Fuel' ? <Fuel size={14} style={{ color: 'var(--status-info)' }} /> : <DollarSign size={14} />}
                                        <span className={`status-pill ${exp.type === 'Fuel' ? 'info' : 'warning'}`}>
                                            {exp.type}
                                        </span>
                                    </div>
                                </td>
                                <td>{exp.type === 'Fuel' ? `${exp.liters} Liters` : '-'}</td>
                                <td style={{ color: 'var(--status-danger)', fontWeight: '600' }}>${exp.cost}</td>
                            </tr>
                        ))}
                        {filteredExpenses.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No expense records found.</td>
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
                        <h3 style={{ gridColumn: 'span 2', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>Log Operational Expense</h3>

                        <div className="form-group">
                            <label>Select Vehicle</label>
                            <select name="vehicleId" className="form-control" onChange={handleChange} required>
                                <option value="">-- Choose Vehicle --</option>
                                {vehicles.map(v => (
                                    <option key={v._id} value={v._id}>{v.licensePlate}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Expense Type</label>
                            <select name="type" className="form-control" onChange={handleChange}>
                                <option value="Fuel">Fuel</option>
                                <option value="Tolls">Tolls</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {formData.type === 'Fuel' && (
                            <div className="form-group">
                                <label>Liters Refueled</label>
                                <input type="number" name="liters" className="form-control" onChange={handleChange} required />
                            </div>
                        )}

                        <div className="form-group">
                            <label>Total Cost ($)</label>
                            <input type="number" name="cost" className="form-control" onChange={handleChange} required placeholder="0.00" />
                        </div>

                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Record</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ExpenseLogs;
