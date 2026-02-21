const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Get all vehicles
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vehicles' });
    }
});

// Create new vehicle
router.post('/', async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error creating vehicle', error });
    }
});

// Update vehicle (e.g., mark retired, update odometer)
router.put('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(vehicle);
    } catch (error) {
        res.status(400).json({ message: 'Error updating vehicle', error });
    }
});

// Get active fleet count & In Shop count for Dashboard
router.get('/stats', async (req, res) => {
    try {
        const onTrip = await Vehicle.countDocuments({ status: 'On Trip' });
        const inShop = await Vehicle.countDocuments({ status: 'In Shop' });
        const total = await Vehicle.countDocuments({ status: { $ne: 'Retired' } });
        const available = await Vehicle.countDocuments({ status: 'Available' });

        res.json({ onTrip, inShop, total, available });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Delete vehicle permanently
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json({ message: 'Vehicle deleted successfully', vehicle });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting vehicle', error });
    }
});

module.exports = router;
