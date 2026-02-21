import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, Printer } from 'lucide-react';
<<<<<<< HEAD
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
    const [showNotifications, setShowNotifications] = useState(false);
=======
import './Header.css';

const Header = () => {
    const [user, setUser] = useState({ name: 'Guest', role: 'Viewer' });
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
<<<<<<< HEAD
                const parsedUser = JSON.parse(storedUser);
                const role = parsedUser.role || 'Manager';
                setUser({
                    name: parsedUser.name || 'User',
                    role: role,
                    profilePhoto: parsedUser.profilePhoto || null
                });
            } catch (e) {
                console.error('Error parsing user from local storage:', e);
=======
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data from localStorage");
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
            }
        }
    }, []);

<<<<<<< HEAD
    const roleName = user.role === 'Manager' ? 'Fleet Manager' : user.role;
    const roleDescription = roleDescriptions[user.role] || roleDescriptions['Manager'];

    const mockNotifications = [
        { id: 1, text: 'Vehicle #402 needs diagnostic check.', time: '10 mins ago', type: 'warning' },
        { id: 2, text: 'Trip DP-1049 successfully delivered.', time: '1 hour ago', type: 'success' },
        { id: 3, text: 'System update scheduled for 2AM.', time: '4 hours ago', type: 'info' },
    ];

    return (
        <header className="main-header glass-panel">
            <div className="header-breadcrumbs">
=======
    return (
        <header className="main-header glass-panel">
            <div className="header-breadcrumbs">
                {/* Placeholder for dynamic breadcrumbs or title */}
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Command Center</h3>
            </div>

            <div className="header-actions">
                <button className="icon-btn" title="Print View">
                    <Printer size={20} />
                </button>
<<<<<<< HEAD
                <div className="notification-wrapper">
                    <button
                        className={`icon-btn ${showNotifications ? 'active' : ''}`}
                        title="Notifications"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        <span className="badge">3</span>
                    </button>

                    {showNotifications && (
                        <div className="notifications-dropdown glass-panel">
                            <div className="notif-header">
                                <h4>Notifications</h4>
                                <button className="clear-btn">Clear list</button>
                            </div>
                            <div className="notif-list">
                                {mockNotifications.map(n => (
                                    <div key={n.id} className="notif-item">
                                        <span className={`notif-indicator ${n.type}`}></span>
                                        <div className="notif-content">
                                            <p>{n.text}</p>
                                            <small className="notif-time">{n.time}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

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
=======


                <div className="user-profile">
                    <UserCircle size={28} style={{ color: 'var(--accent-primary)' }} />
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
