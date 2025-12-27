const router = require('express').Router();
const CanteenItem = require('../models/CanteenItem');
const { verifyToken } = require('../middleware/auth');

router.post('/add', verifyToken, async (req, res) => {
    try {
        const newItem = new CanteenItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) { res.status(500).json(err); }
});

router.get('/all', async (req, res) => {
    try {
        const items = await CanteenItem.find();
        res.json(items);
    } catch (err) { res.status(500).json(err); }
});

router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const updated = await CanteenItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        await CanteenItem.findByIdAndDelete(req.params.id);
        res.json("Canteen item deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;