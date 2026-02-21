const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

// Get all trips with filtering and search
router.get('/', async (req, res) => {
    try {
        const { search, status } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { startLocation: { $regex: search, $options: 'i' } },
                { endLocation: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) query.status = status;

        const trips = await Trip.find(query).populate('vehicleId').populate('driverId');
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips' });
    }
});

// Create a trip (Validation Rule: Prevent trip creation if CargoWeight > MaxCapacity)
router.post('/', async (req, res) => {
    try {
        const { vehicleId, driverId, cargoWeight } = req.body;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (cargoWeight > vehicle.maxLoadCapacity) {
            return res.status(400).json({ message: `Cargo Weight (${cargoWeight}kg) exceeds Vehicle Max Capacity (${vehicle.maxLoadCapacity}kg)` });
        }

        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        // Check License Expiry
        if (new Date(driver.licenseExpiry) < new Date()) {
            return res.status(400).json({ message: 'Driver license has expired' });
        }

        const trip = new Trip(req.body);
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: 'Error creating trip', error });
    }
});

// Update Trip Status (Lifecycle: Draft -> Dispatched -> Completed)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, odometer } = req.body;
        const trip = await Trip.findById(req.params.id);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        trip.status = status;
        await trip.save();

        // Auto-Logic for Status updates
        if (status === 'Dispatched') {
            await Vehicle.findByIdAndUpdate(trip.vehicleId, { status: 'On Trip' });
            await Driver.findByIdAndUpdate(trip.driverId, { status: 'On Duty' });
        } else if (status === 'Completed' || status === 'Cancelled') {
            await Vehicle.findByIdAndUpdate(trip.vehicleId, {
                status: 'Available',
                ...(odometer && { odometer }) // Update odometer if provided
            });
            await Driver.findByIdAndUpdate(trip.driverId, { status: 'Off Duty' });
        }

        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: 'Error updating status', error });
    }
});

module.exports = router;
