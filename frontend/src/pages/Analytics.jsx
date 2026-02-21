import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, TrendingUp, DollarSign, Wrench } from 'lucide-react';

const Analytics = () => {
    const [analytics, setAnalytics] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/expenses/analytics');
            setAnalytics(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const exportCSV = () => {
        const headers = ['Vehicle Plate', 'Vehicle Type', 'Revenue', 'Fuel Cost', 'Maintenance Cost', 'ROI'];
        const rows = analytics.map(a => [
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

    return (
        <div className="page-container" style={{ position: 'relative', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2>Operational & Financial Analytics</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Track Vehicle ROI and overall spending</p>
                </div>
                <button className="btn btn-secondary" onClick={exportCSV}>
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

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
                        {analytics.map((item) => {
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
                        {analytics.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No analytics data available yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FuelIcon = () => <DollarSign size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />;
const WrenchIcon = () => <Wrench size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />;

export default Analytics;
