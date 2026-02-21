const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    description: { type: String, required: true }, // e.g., 'Oil Change'
    cost: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    type: {
        type: String,
        enum: ['Preventative', 'Reactive'],
        default: 'Preventative'
    }
}, { timestamps: true });

// Pre-save hook to update vehicle status to "In Shop"
maintenanceLogSchema.pre('save', async function (next) {
    try {
        const Vehicle = mongoose.model('Vehicle');
        await Vehicle.findByIdAndUpdate(this.vehicleId, { status: 'In Shop' });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
