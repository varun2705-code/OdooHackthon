import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';

import Vehicles from './pages/VehicleRegistry';
import Dispatch from './pages/TripDispatcher';
import Maintenance from './pages/MaintenanceLogs';
import Expenses from './pages/ExpenseLogs';

import Drivers from './pages/DriverProfiles';
import Analytics from './pages/Analytics';
<<<<<<< HEAD
<<<<<<< HEAD
import Profile from './pages/Profile';

export const roleAccess = {
  'Manager': ['/dashboard', '/vehicles', '/maintenance', '/analytics', '/profile'],
  'Dispatcher': ['/dashboard', '/dispatch', '/drivers', '/profile'],
  'Safety Officer': ['/dashboard', '/drivers', '/vehicles', '/profile'],
  'Financial Analyst': ['/dashboard', '/expenses', '/analytics', '/profile']
=======
import Profile from './pages/Profile';

export const roleAccess = {
  'Manager': ['/dashboard', '/vehicles', '/dispatch', '/maintenance', '/expenses', '/drivers', '/analytics', '/profile'],
  'Dispatcher': ['/dashboard', '/dispatch', '/drivers', '/vehicles', '/profile'],
  'Safety Officer': ['/dashboard', '/drivers', '/vehicles', '/maintenance', '/profile'],
  'Financial Analyst': ['/dashboard', '/expenses', '/analytics', '/vehicles', '/profile']
>>>>>>> feature
};

const ProtectedRoute = ({ element, path }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/" replace />;
  try {
    const user = JSON.parse(userStr);
    const role = user.role || 'Manager';
    const allowedPath = roleAccess[role]?.includes(path);
    if (!allowedPath && path !== '/dashboard') {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  } catch (e) {
    return <Navigate to="/" replace />;
  }
<<<<<<< HEAD
=======
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';

const AdminRoute = ({ children }) => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const isAdmin = user && (user.email === 'varun@gmail.com' || user.role === 'Admin');
  return isAdmin ? children : <Navigate to="/dashboard" replace />;
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
=======
>>>>>>> feature
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature
          <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" element={<Dashboard />} />} />
          <Route path="/vehicles" element={<ProtectedRoute path="/vehicles" element={<Vehicles />} />} />
          <Route path="/dispatch" element={<ProtectedRoute path="/dispatch" element={<Dispatch />} />} />
          <Route path="/maintenance" element={<ProtectedRoute path="/maintenance" element={<Maintenance />} />} />
          <Route path="/expenses" element={<ProtectedRoute path="/expenses" element={<Expenses />} />} />
          <Route path="/drivers" element={<ProtectedRoute path="/drivers" element={<Drivers />} />} />
          <Route path="/analytics" element={<ProtectedRoute path="/analytics" element={<Analytics />} />} />
          <Route path="/profile" element={<ProtectedRoute path="/profile" element={<Profile />} />} />
<<<<<<< HEAD
=======
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/dispatch" element={<Dispatch />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><ManageUsers /></AdminRoute>} />
>>>>>>> 2e85b873d150fa551d25a40cf84d9ec51c40bb4b
=======
>>>>>>> feature
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
