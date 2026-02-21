import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, Printer } from 'lucide-react';
import './Header.css';

const roleDescriptions = {
    'Manager': 'Oversee vehicle health, asset lifecycle, and scheduling.',
    'Dispatcher': 'Create trips, assign drivers, and validate cargo loads.',
    'Safety Officer': 'Monitor driver compliance, license expirations, and safety scores.',
    'Financial Analyst': 'Audit fuel spend, maintenance ROI, and operational costs.'
};

const Header = () => {
    const [user, setUser] = useState({ name: 'Alex Manager', role: 'Manager' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const role = parsedUser.role || 'Manager';
                setUser({
                    name: parsedUser.name || 'User',
                    role: role
                });
            } catch (e) {
                console.error('Error parsing user from local storage:', e);
            }
        }
    }, []);

    const roleName = user.role === 'Manager' ? 'Fleet Manager' : user.role;
    const roleDescription = roleDescriptions[user.role] || roleDescriptions['Manager'];

    return (
        <header className="main-header glass-panel">
            <div className="header-breadcrumbs">
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Command Center</h3>
            </div>

            <div className="header-actions">
                <button className="icon-btn" title="Print View">
                    <Printer size={20} />
                </button>
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>

                <div className="user-profile">
                    <UserCircle size={28} style={{ color: 'var(--accent-primary)' }} />
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{roleName}</span>
                    </div>

                    <div className="user-profile-dropdown glass-panel">
                        <div className="dropdown-role">{roleName}</div>
                        <div className="dropdown-desc">{roleDescription}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
