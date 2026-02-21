const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'],
        default: 'Dispatcher'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
