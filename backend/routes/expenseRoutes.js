const express = require('express');
const router = express.Router();
const ExpenseLog = require('../models/ExpenseLog');

// Get expenses
router.get('/', async (req, res) => {
    try {
        const expenses = await ExpenseLog.find().populate('vehicleId').populate('tripId');
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses' });
    }
});

// Create expense
router.post('/', async (req, res) => {
    try {
        const expense = new ExpenseLog(req.body);
        await expense.save();
        res.status(201).json(expense);
    } catch (error) {
        res.status(400).json({ message: 'Error logging expense', error });
    }
});

// Analytics: Get Financial Analytics for vehicles (ROI, Fuel Efficiency)
router.get('/analytics', async (req, res) => {
    try {
        // This is a simplified analytics aggregation
        // For a real app, this would use MongoDB aggregates
        const expenses = await ExpenseLog.find().populate('vehicleId');
        const Vehicle = require('../models/Vehicle');
        const Trip = require('../models/Trip');

        const vehicles = await Vehicle.find();
        const trips = await Trip.find({ status: 'Completed' });

        const analytics = vehicles.map(vehicle => {
            const vTrips = trips.filter(t => t.vehicleId.toString() === vehicle._id.toString());
            const vExpenses = expenses.filter(e => e.vehicleId && e.vehicleId._id.toString() === vehicle._id.toString());

            const totalRevenue = vTrips.reduce((sum, t) => sum + (t.revenue || 0), 0);
            const totalFuelCost = vExpenses.filter(e => e.type === 'Fuel').reduce((sum, e) => sum + e.cost, 0);
            const totalMaintenanceCost = vExpenses.filter(e => e.type !== 'Fuel').reduce((sum, e) => sum + e.cost, 0);

            // ROI Calculation: (Revenue - (Maintenance + Fuel)) / Acquisition Cost
            const acqCost = vehicle.acquisitionCost || 1; // Prevent div by zero
            const roi = ((totalRevenue - (totalMaintenanceCost + totalFuelCost)) / acqCost) * 100;

            return {
                vehicle,
                revenue: totalRevenue,
                fuelCost: totalFuelCost,
                maintenanceCost: totalMaintenanceCost,
                roi: `${roi.toFixed(2)}%`
            };
        });

        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
});

module.exports = router;
