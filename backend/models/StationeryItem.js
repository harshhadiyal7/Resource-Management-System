const mongoose = require('mongoose');

const stationerySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    brand: { type: String, default: 'Generic' },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('StationeryItem', stationerySchema);