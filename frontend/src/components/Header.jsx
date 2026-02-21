import React, { useState, useEffect } from 'react';
import { UserCircle, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const roleDescriptions = {
    'Manager': 'Oversee vehicle health, asset lifecycle, and scheduling.',
    'Dispatcher': 'Create trips, assign drivers, and validate cargo loads.',
    'Safety Officer': 'Monitor driver compliance, license expirations, and safety scores.',
    'Financial Analyst': 'Audit fuel spend, maintenance ROI, and operational costs.'
};

const Header = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ name: 'Alex Manager', role: 'Manager' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                const role = parsedUser.role || 'Manager';
                setUser({
                    name: parsedUser.name || 'User',
                    role: role,
                    profilePhoto: parsedUser.profilePhoto || null
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
                <button className="icon-btn" title="Print View" onClick={() => window.print()}>
                    <Printer size={20} />
                </button>

                <div className="user-profile" onClick={() => navigate('/profile')}>
                    {user.profilePhoto ? (
                        <img
                            src={user.profilePhoto}
                            alt="Profile"
                            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                    ) : (
                        <UserCircle size={28} style={{ color: 'var(--accent-primary)' }} />
                    )}
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
