const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, default: 'canteen' }
}, { timestamps: true });

module.exports = mongoose.model('CanteenItem', canteenSchema);