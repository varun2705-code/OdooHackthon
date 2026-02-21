require('dotenv').config();
const mongoose = require('mongoose');
const MaintenanceLog = require('./models/MaintenanceLog');
const Vehicle = require('./models/Vehicle');

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const logs = await MaintenanceLog.find().populate('vehicleId');
        console.log('--- Maintenance Logs ---');
        console.log(JSON.stringify(logs, null, 2));

        const vehicles = await Vehicle.find();
        console.log('--- Vehicles ---');
        console.log(JSON.stringify(vehicles, null, 2));

        await mongoose.disconnect();
    } catch (err) {
        console.error('DB Check Error:', err);
    }
};

checkDB();
