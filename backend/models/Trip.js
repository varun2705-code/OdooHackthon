const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    cargoWeight: { type: Number, required: true }, // in kg
    status: {
        type: String,
        enum: ['Draft', 'Dispatched', 'Completed', 'Cancelled'],
        default: 'Draft'
    },
    revenue: { type: Number, default: 0 },
    startLocation: { type: String },
    endLocation: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
