const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
    roomNumber: { type: String, required: true },
    studentName: { type: String, default: 'Vacant' },
    status: { type: String, default: 'Available' }
}, { timestamps: true });

module.exports = mongoose.model('HostelItem', hostelSchema);