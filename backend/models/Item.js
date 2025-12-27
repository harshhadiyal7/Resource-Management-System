const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    category: {
        type: String,
        required: true,
        
        
    },
    price: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    status: { type: String, default: 'Available' },
    description: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);