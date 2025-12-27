const router = require('express').Router();
const StationeryItem = require('../models/StationeryItem');
const { verifyToken } = require('../middleware/auth');

// 1. ADD ITEM
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { itemName, brand, price, quantity } = req.body;
        const newItem = new StationeryItem({
            itemName,
            brand,
            price: Number(price),
            quantity: Number(quantity),
            status: Number(quantity) > 0 ? 'In Stock' : 'Out of Stock'
        });
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL ITEMS
router.get('/all', async (req, res) => {
    try {
        const items = await StationeryItem.find().sort({ itemName: 1 });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. UPDATE ITEM
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { itemName, brand, price, quantity } = req.body;
        const updatedStatus = Number(quantity) > 0 ? 'In Stock' : 'Out of Stock';

        const updatedItem = await StationeryItem.findByIdAndUpdate(
            req.params.id,
            { itemName, brand, price: Number(price), quantity: Number(quantity), status: updatedStatus },
            { new: true }
        );
        res.status(200).json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. DELETE ITEM
router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        await StationeryItem.findByIdAndDelete(req.params.id);
        res.status(200).json("Stationery item deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;