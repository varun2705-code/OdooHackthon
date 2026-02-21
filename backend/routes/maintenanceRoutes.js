const express = require('express');
const router = express.Router();
const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

// Get maintenance logs
router.get('/', async (req, res) => {
    try {
        const logs = await MaintenanceLog.find().populate('vehicleId');
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching maintenance logs' });
    }
});

// Create maintenance log
router.post('/', async (req, res) => {
    try {
        const log = new MaintenanceLog(req.body);
        await log.save(); // Note: Pre-save hook in model will update vehicle status to "In Shop"
        res.status(201).json(log);
    } catch (error) {
        console.error('Error in maintenance POST:', error);
        res.status(400).json({ message: 'Error logging maintenance', error: error.message || error });
    }
});

// Complete maintenance and release vehicle
router.put('/:id/complete', async (req, res) => {
    try {
        const log = await MaintenanceLog.findById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });

        log.completed = true;
        await log.save();

        // Update vehicle status back to Available
        await Vehicle.findByIdAndUpdate(log.vehicleId, { status: 'Available' });

        res.json({ message: 'Maintenance completed, vehicle back in service', log });
    } catch (error) {
        res.status(400).json({ message: 'Error completing maintenance', error });
    }
});

module.exports = router;
