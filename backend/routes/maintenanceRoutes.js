const express = require('express');
const router = express.Router();
const MaintenanceLog = require('../models/MaintenanceLog');
const Vehicle = require('../models/Vehicle');

// Get maintenance logs with filtering and search
router.get('/', async (req, res) => {
    try {
        const { search, type } = req.query;
        let query = {};

        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        if (type) query.type = type;

        const logs = await MaintenanceLog.find(query).populate('vehicleId');
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

        // Check if there are any OTHER active maintenance logs for this vehicle
        const activeLogsCount = await MaintenanceLog.countDocuments({
            vehicleId: log.vehicleId,
            completed: false,
            _id: { $ne: log._id }
        });

        // Only update vehicle status back to Available if no other active logs exist
        if (activeLogsCount === 0) {
            await Vehicle.findByIdAndUpdate(log.vehicleId, { status: 'Available' });
        }

        res.json({ message: 'Maintenance completed', log, vehicleReleased: activeLogsCount === 0 });
    } catch (error) {
        res.status(400).json({ message: 'Error completing maintenance', error });
    }
});

module.exports = router;
