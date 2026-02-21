import React from 'react';
import { Bell, UserCircle, Printer } from 'lucide-react';
import './Header.css';

const Header = () => {
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
                <button className="icon-btn" title="Notifications">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>

                <div className="user-profile">
                    <UserCircle size={28} style={{ color: 'var(--accent-primary)' }} />
                    <div className="user-info">
                        <span className="user-name">Alex Manager</span>
                        <span className="user-role">Fleet Manager</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
