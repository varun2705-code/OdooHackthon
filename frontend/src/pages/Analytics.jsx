import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, TrendingUp, DollarSign, Wrench } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Analytics = () => {
    const [analytics, setAnalytics] = useState([]);
    const [filteredAnalytics, setFilteredAnalytics] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async (searchVal) => {
        try {
            const currentSearch = typeof searchVal === 'string' ? searchVal : searchTerm;
            const res = await axios.get('http://localhost:5000/api/expenses/analytics');
            let data = res.data;

            if (currentSearch) {
                const searchLower = currentSearch.toLowerCase();
                data = data.filter(item =>
                    item.vehicle.licensePlate.toLowerCase().includes(searchLower) ||
                    item.vehicle.type.toLowerCase().includes(searchLower)
                );
            }

            setAnalytics(res.data);
            setFilteredAnalytics(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSearchTrigger = (val) => {
        setSearchTerm(val);
        fetchAnalytics(val);
    };

    const exportCSV = () => {
        const headers = ['Vehicle Plate', 'Vehicle Type', 'Revenue', 'Fuel Cost', 'Maintenance Cost', 'ROI'];
        const rows = filteredAnalytics.map(a => [
            a.vehicle.licensePlate,
            a.vehicle.type,
            a.revenue,
            a.fuelCost,
            a.maintenanceCost,
            a.roi
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "fleet_financial_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatCurrency = (val) => {
        return '$' + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const FuelIcon = () => <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />;
    const WrenchIcon = () => <Wrench size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />;

    return (
        <div className="analytics-page">
            <PageHeader
                title="Operational & Financial Analytics"
                subtitle="High-level insights into asset ROI, operational costs, and overall fleet spend."
                onSearch={handleSearchTrigger}
            />

            <div className="analytics-actions no-print" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={exportCSV}>
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="analytics-catalog glass-panel" style={{ padding: '1.5rem' }}>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Vehicle Asset</th>
                                <th>Total Revenue</th>
                                <th><FuelIcon /> Fuel Spend</th>
                                <th><WrenchIcon /> Maintenance</th>
                                <th>Vehicle ROI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnalytics.map((item) => {
                                const roiValue = parseFloat(item.roi);
                                return (
                                    <tr key={item.vehicle._id}>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontWeight: '500' }}>{item.vehicle.licensePlate}</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cost: {formatCurrency(item.vehicle.acquisitionCost)}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: 'var(--status-success)', fontWeight: '600' }}>{formatCurrency(item.revenue)}</td>
                                        <td style={{ color: 'var(--status-info)' }}>{formatCurrency(item.fuelCost)}</td>
                                        <td style={{ color: 'var(--status-warning)' }}>{formatCurrency(item.maintenanceCost)}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{
                                                    color: roiValue >= 0 ? 'var(--status-success)' : 'var(--status-danger)',
                                                    fontWeight: 'bold',
                                                    padding: '0.25rem 0.5rem',
                                                    background: roiValue >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    borderRadius: '4px'
                                                }}>
                                                    {item.roi}
                                                </span>
                                                {roiValue >= 0 ? <TrendingUp size={16} color="var(--status-success)" /> : <TrendingUp size={16} color="var(--status-danger)" style={{ transform: 'scaleY(-1)' }} />}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredAnalytics.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No analytics data available for your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
