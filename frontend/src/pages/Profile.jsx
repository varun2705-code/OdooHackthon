<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { UserCircle, Camera, Save } from 'lucide-react';
=======
import React, { useState, useEffect, useRef } from 'react';
import { UserCircle, Camera, Save, Plus, Upload, Trash2, X } from 'lucide-react';
>>>>>>> feature
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
<<<<<<< HEAD
=======
    const [showPhotoActions, setShowPhotoActions] = useState(false);

    // Camera logic states
    const [showCameraModal, setShowCameraModal] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
>>>>>>> feature

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

<<<<<<< HEAD
=======
    const handleDeletePhoto = () => {
        setUser((prev) => ({ ...prev, profilePhoto: null }));
        setShowPhotoActions(false);
    };

    const handleTakePhoto = async () => {
        setShowPhotoActions(false);
        setShowCameraModal(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please check your browser permissions.");
            setShowCameraModal(false);
        }
    };

    const stopCameraStream = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageDataUrl = canvas.toDataURL('image/png');
            setUser((prev) => ({ ...prev, profilePhoto: imageDataUrl }));

            stopCameraStream();
            setShowCameraModal(false);
        }
    };

    const closeCamera = () => {
        stopCameraStream();
        setShowCameraModal(false);
    };

>>>>>>> feature
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

<<<<<<< HEAD
=======
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];

    // Max age 100 years
    const minDateObj = new Date(today);
    minDateObj.setFullYear(today.getFullYear() - 100);
    const minDate = minDateObj.toISOString().split('T')[0];

>>>>>>> feature
    return (
        <div className="profile-page">
            <h1 className="page-title">Personal Profile</h1>
            <p className="page-subtitle">Manage your account information and preferences</p>

            <div className="profile-container glass-panel">
                <div className="profile-sidebar">
                    <div className="profile-photo-wrapper">
<<<<<<< HEAD
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
=======
                        <div className="profile-photo-inner">
                            {user.profilePhoto ? (
                                <img src={user.profilePhoto} alt="Profile" className="profile-photo" />
                            ) : (
                                <div className="profile-photo-placeholder">
                                    <UserCircle size={80} color="var(--text-secondary)" />
                                </div>
                            )}
                        </div>
                        <div className={`photo-actions-container ${showPhotoActions ? 'active' : ''}`}>
                            <label className="photo-action-item upload" title="Upload Photo">
                                <Upload size={16} />
                                <input type="file" accept="image/*" onChange={(e) => { handlePhotoChange(e); setShowPhotoActions(false); }} hidden />
                            </label>
                            <button className="photo-action-item take" type="button" title="Take Photo" onClick={handleTakePhoto}>
                                <Camera size={16} />
                            </button>
                            <button className="photo-action-item delete" type="button" title="Delete Photo" onClick={handleDeletePhoto}>
                                <Trash2 size={16} />
                            </button>
                            <button className="photo-main-btn" type="button" title="Profile Photo Options" onClick={() => setShowPhotoActions(!showPhotoActions)}>
                                <Plus size={20} />
                            </button>
                        </div>
>>>>>>> feature
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
<<<<<<< HEAD
=======
                                    min={minDate}
                                    max={maxDate}
>>>>>>> feature
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group row">
                            <div className="col">
<<<<<<< HEAD
                                <label>System Role <span style={{ fontSize: '0.75rem', color: 'var(--status-warning)' }}>(Immutable)</span></label>
=======
                                <label>System Role</label>
>>>>>>> feature
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
<<<<<<< HEAD
=======

            {showCameraModal && (
                <div className="camera-modal-overlay">
                    <div className="camera-modal glass-panel">
                        <button className="close-camera-btn" onClick={closeCamera}>
                            <X size={24} />
                        </button>
                        <div className="camera-viewport">
                            <video ref={videoRef} className="camera-video" autoPlay playsInline muted></video>
                            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        </div>
                        <div className="camera-controls">
                            <button className="btn btn-primary capture-btn" onClick={capturePhoto}>
                                <Camera size={20} /> Capture Photo
                            </button>
                        </div>
                    </div>
                </div>
            )}
>>>>>>> feature
        </div>
    );
};

export default Profile;
