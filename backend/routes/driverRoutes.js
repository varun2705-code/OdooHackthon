const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers with filtering and search
router.get('/', async (req, res) => {
    try {
        const { search, status, category } = req.query;
        let query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (status) query.status = status;
        if (category) query.licenseCategory = category;

        const drivers = await Driver.find(query);
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching drivers' });
    }
});

// Create driver
router.post('/', async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json({ message: 'Error creating driver', error });
    }
});

// Update driver (e.g., status, safety score)
router.put('/:id', async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(driver);
    } catch (error) {
        res.status(400).json({ message: 'Error updating driver', error });
    }
});

module.exports = router;
