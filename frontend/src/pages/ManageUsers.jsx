import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageUsers.css'; // Shared premium table styles

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentUser, setCurrentUser] = useState({ name: '', email: '', role: 'Dispatcher', password: '' });

    // Fetch users
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Handlers
    const handleAddClick = () => {
        setModalMode('add');
        setCurrentUser({ name: '', email: '', role: 'Dispatcher', password: '' });
        setShowModal(true);
    };

    const handleEditClick = (user) => {
        setModalMode('edit');
        setCurrentUser({ ...user, password: '' }); // Don't prefill password
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`);
                setUsers(users.filter(u => u._id !== id));
            } catch (error) {
                console.error('Error deleting user', error);
                alert('Failed to delete user');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (modalMode === 'add') {
                const res = await axios.post('http://localhost:5000/api/users', currentUser);
                setUsers([...users, res.data.user]);
            } else {
                const res = await axios.put(`http://localhost:5000/api/users/${currentUser._id}`, currentUser);
                setUsers(users.map(u => u._id === currentUser._id ? res.data.user : u));
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error saving user', error);
            alert(error.response?.data?.message || 'Error saving user');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentUser(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="manage-users-container fade-in">
            <header className="page-header flex-between">
                <div>
                    <h1>User Management</h1>
                    <p>Add, edit, and control access for all platform personnel.</p>
                </div>
                <button onClick={handleAddClick} className="btn-primary custom-btn">
                    + Add New User
                </button>
            </header>

            <div className="table-wrapper glass-panel">
                {loading ? (
                    <div className="loader">Loading...</div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center empty-state">No users found. Create one.</td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td className="font-semibold">{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`role-badge role-${user.role.replace(/\s+/g, '-').toLowerCase()}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td className="actions-cell">
                                            <button onClick={() => handleEditClick(user)} className="icon-btn edit-btn" title="Edit">✏️</button>
                                            <button onClick={() => handleDelete(user._id)} className="icon-btn delete-btn" title="Delete">🗑️</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-modal slide-up">
                        <div className="modal-header">
                            <h2>{modalMode === 'add' ? 'Create New User' : 'Edit User Profile'}</h2>
                            <button onClick={() => setShowModal(false)} className="close-btn">×</button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={currentUser.name} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={currentUser.email} onChange={handleChange} required placeholder="john@example.com" />
                            </div>

                            <div className="form-group">
                                <label>System Role</label>
                                <select name="role" value={currentUser.role} onChange={handleChange}>
                                    <option value="Manager">Manager</option>
                                    <option value="Dispatcher">Dispatcher</option>
                                    <option value="Safety Officer">Safety Officer</option>
                                    <option value="Financial Analyst">Financial Analyst</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>{modalMode === 'add' ? 'Password' : 'New Password (Leave blank to keep current)'}</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={currentUser.password}
                                    onChange={handleChange}
                                    required={modalMode === 'add'}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-cancel">Cancel</button>
                                <button type="submit" className="btn-save">{modalMode === 'add' ? 'Create User' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
