import React, { useState, useEffect } from 'react';
import { Bell, UserCircle, Printer } from 'lucide-react';
import './Header.css';

const Header = () => {
    const [user, setUser] = useState({ name: 'Guest', role: 'Viewer' });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user data from localStorage");
            }
        }
    }, []);

    return (
        <header className="main-header glass-panel">
            <div className="header-breadcrumbs">
                {/* Placeholder for dynamic breadcrumbs or title */}
                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Command Center</h3>
            </div>

            <div className="header-actions">
                <button className="icon-btn" title="Print View">
                    <Printer size={20} />
                </button>


                <div className="user-profile">
                    <UserCircle size={28} style={{ color: 'var(--accent-primary)' }} />
                    <div className="user-info">
                        <span className="user-name">{user.name}</span>
                        <span className="user-role">{user.role}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
