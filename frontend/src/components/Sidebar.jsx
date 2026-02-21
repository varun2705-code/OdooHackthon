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
    LogOut,
    Shield
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
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

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user && (user.email === 'varun@gmail.com' || user.role === 'Admin');

    if (isAdmin) {
        navItems.push({ path: '/admin', name: 'Admin Panel', icon: <Shield size={20} /> });
    }

    return (
        <div className="sidebar glass-panel">
            <div className="sidebar-header">


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
