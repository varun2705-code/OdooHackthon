const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    licenseCategory: { type: String, required: true }, // e.g., 'Truck', 'Van'
    licenseExpiry: { type: Date, required: true },
    safetyScore: { type: Number, default: 100 }, // out of 100
    status: {
        type: String,
        enum: ['On Duty', 'Off Duty', 'Suspended'],
        default: 'On Duty'
    }
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
