import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Map,
    Wrench,
    CreditCard,
    Users,
    BarChart,
    LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app we'd clear tokens here
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/vehicles', name: 'Vehicle Registry', icon: <Truck size={20} /> },
        { path: '/dispatch', name: 'Trip Dispatcher', icon: <Map size={20} /> },
        { path: '/maintenance', name: 'Maintenance Logs', icon: <Wrench size={20} /> },
        { path: '/expenses', name: 'Expense Logs', icon: <CreditCard size={20} /> },
        { path: '/drivers', name: 'Driver Profiles', icon: <Users size={20} /> },
        { path: '/analytics', name: 'Analytics', icon: <BarChart size={20} /> },
    ];

    return (
        <div className="sidebar glass-panel">
            <div className="sidebar-header">
                <h2 className="logo">FleetFlow</h2>
                <span className="version">v1.0</span>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="btn btn-secondary logout-btn" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </div >
    );
};

export default Sidebar;
