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
    },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

// Pre-save hook to update vehicle status to "In Shop"
maintenanceLogSchema.pre('save', async function () {
    try {
        const Vehicle = mongoose.model('Vehicle');
        await Vehicle.findByIdAndUpdate(this.vehicleId, { status: 'In Shop' });
    } catch (error) {
        console.error('Error in MaintenanceLog pre-save hook:', error);
        throw error;
    }
});

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
