const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    model: { type: String },
    licensePlate: { type: String, required: true, unique: true },
    maxLoadCapacity: { type: Number, required: true }, // in kg
    odometer: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
        default: 'Available'
    },
    acquisitionCost: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ['Truck', 'Van', 'Bike'],
        default: 'Van'
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
