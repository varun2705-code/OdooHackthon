import React, { useState, useEffect } from 'react';
import { UserCircle, Camera, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        role: '',
        dob: '',
        profilePhoto: null
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    name: parsedUser.name || '',
                    email: parsedUser.email || '',
                    role: parsedUser.role || 'Manager',
                    dob: parsedUser.dob || '',
                    profilePhoto: parsedUser.profilePhoto || null,
                });
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (upload) => {
                setUser((prev) => ({ ...prev, profilePhoto: upload.target.result }));
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage('');

        // Simulate API call to save Profile details
        setTimeout(() => {
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...storedUser, ...user, role: storedUser.role || user.role };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setIsSaving(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        }, 800);
    };

    return (
        <div className="profile-page">
            <h1 className="page-title">Personal Profile</h1>
            <p className="page-subtitle">Manage your account information and preferences</p>

            <div className="profile-container glass-panel">
                <div className="profile-sidebar">
                    <div className="profile-photo-wrapper">
                        {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
                        ) : (
                            <div className="profile-photo-placeholder">
                                <UserCircle size={80} color="var(--text-secondary)" />
                            </div>
                        )}
                        <label className="photo-upload-btn" title="Change Photo">
                            <Camera size={18} />
                            <input type="file" accept="image/*" onChange={handlePhotoChange} hidden />
                        </label>
                    </div>
                    <div className="profile-brief">
                        <h2>{user.name || 'User'}</h2>
                        <span className="status-pill info">{user.role === 'Manager' ? 'Fleet Manager' : user.role}</span>
                    </div>
                </div>

                <div className="profile-form-wrapper">
                    <form onSubmit={handleSave} className="profile-form">
                        <div className="form-group row">
                            <div className="col">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    placeholder="Enter your full name"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="yourname@domain.com"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    className="form-control"
                                    value={user.dob}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col">
                                <label>System Role <span style={{ fontSize: '0.75rem', color: 'var(--status-warning)' }}>(Immutable)</span></label>
                                <input
                                    type="text"
                                    className="form-control disabled-input"
                                    value={user.role === 'Manager' ? 'Fleet Manager' : user.role}
                                    disabled
                                />
                                <small className="helper-text text-muted" style={{ marginTop: '0.25rem', display: 'block' }}>
                                    Your role is determined by the system administrator.
                                </small>
                            </div>
                        </div>

                        <div className="profile-actions">
                            {message && <span className="success-msg">{message}</span>}
                            <button type="submit" className="btn btn-primary start-btn" disabled={isSaving}>
                                <Save size={18} />
                                {isSaving ? 'Saving...' : 'Save Profile Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
