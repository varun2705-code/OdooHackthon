<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React from 'react';
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    Map,
    Wrench,
    CreditCard,
    Users,
    BarChart,
<<<<<<< HEAD
    LogOut
} from 'lucide-react';
import './Sidebar.css';
import { roleAccess } from '../App';

const Sidebar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState('Manager');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUserRole(parsedUser.role || 'Manager');
            } catch (e) {
                console.error('Error parsing user from local storage:', e);
            }
        }
    }, []);
=======
    LogOut,
    Shield
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

<<<<<<< HEAD
    const allNavItems = [
=======
    const navItems = [
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
        { path: '/dashboard', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/vehicles', name: 'Vehicle Registry', icon: <Truck size={20} /> },
        { path: '/dispatch', name: 'Trip Dispatcher', icon: <Map size={20} /> },
        { path: '/maintenance', name: 'Maintenance Logs', icon: <Wrench size={20} /> },
        { path: '/expenses', name: 'Expense Logs', icon: <CreditCard size={20} /> },
        { path: '/drivers', name: 'Driver Profiles', icon: <Users size={20} /> },
        { path: '/analytics', name: 'Analytics', icon: <BarChart size={20} /> },
    ];

<<<<<<< HEAD
    const navItems = allNavItems.filter(item => {
        if (item.path === '/dashboard') return true;
        const allowedPaths = roleAccess[userRole];
        return allowedPaths ? allowedPaths.includes(item.path) : false;
    });
=======
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user && (user.email === 'varun@gmail.com' || user.role === 'Admin');

    if (isAdmin) {
        navItems.push({ path: '/admin', name: 'Admin Panel', icon: <Shield size={20} /> });
    }
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b

    return (
        <div className="sidebar glass-panel">
            <div className="sidebar-header">
<<<<<<< HEAD
                <h2 className="logo">FleetFlow</h2>
                <span className="version">v1.0</span>
=======


>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
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
