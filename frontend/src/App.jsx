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

export const roleAccess = {
  'Manager': ['/dashboard', '/vehicles', '/maintenance', '/analytics'],
  'Dispatcher': ['/dashboard', '/dispatch', '/drivers'],
  'Safety Officer': ['/dashboard', '/drivers', '/vehicles'],
  'Financial Analyst': ['/dashboard', '/expenses', '/analytics']
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
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute path="/dashboard" element={<Dashboard />} />} />
          <Route path="/vehicles" element={<ProtectedRoute path="/vehicles" element={<Vehicles />} />} />
          <Route path="/dispatch" element={<ProtectedRoute path="/dispatch" element={<Dispatch />} />} />
          <Route path="/maintenance" element={<ProtectedRoute path="/maintenance" element={<Maintenance />} />} />
          <Route path="/expenses" element={<ProtectedRoute path="/expenses" element={<Expenses />} />} />
          <Route path="/drivers" element={<ProtectedRoute path="/drivers" element={<Drivers />} />} />
          <Route path="/analytics" element={<ProtectedRoute path="/analytics" element={<Analytics />} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
