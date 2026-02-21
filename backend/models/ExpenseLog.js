const mongoose = require('mongoose');

const expenseLogSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }, // Optional link to specific trip
    type: {
        type: String,
        enum: ['Fuel', 'Tolls', 'Other'],
        default: 'Fuel'
    },
    liters: { type: Number }, // Relevant for Fuel
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseLog', expenseLogSchema);
