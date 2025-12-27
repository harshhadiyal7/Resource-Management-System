const router = require('express').Router();
const HostelItem = require('../models/HostelItem');
const { verifyToken } = require('../middleware/auth');

router.post('/add', verifyToken, async (req, res) => {
    try {
        const newItem = new HostelItem(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) { res.status(500).json(err); }
});

router.get('/all', async (req, res) => {
    try {
        const items = await HostelItem.find();
        res.json(items);
    } catch (err) { res.status(500).json(err); }
});

router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const updated = await HostelItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) { res.status(500).json(err); }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await HostelItem.findByIdAndDelete(req.params.id);
        res.json("Room record deleted");
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;