const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    contact: { type: String },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'student', 'canteen', 'hostel', 'stationery']
    },
    status: {
        type: String,
        enum: ['active', 'deactivated', 'deleted'], // Add 'deleted' here
        default: 'active'
    }// Used by admin to deactivate
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);