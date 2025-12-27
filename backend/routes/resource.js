const router = require('express').Router();
const Item = require('../models/Item');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/auth');

// 1. ADD ITEM
router.post('/add-item', verifyToken, async (req, res) => {
    try {
        const { itemName, category, price, quantity } = req.body;
        const newItem = new Item({
            itemName,
            category,
            price: Number(price),
            quantity: Number(quantity),
            status: Number(quantity) > 0 ? 'Available' : 'Out of Stock',
            addedBy: req.user.id
        });
        await newItem.save();
        return res.status(201).json(newItem); // Use return to prevent extra execution
    } catch (err) {
        console.error("Add Item Error:", err);
        return res.status(500).json({ error: err.message });
    }
});

// 2. GET ALL ITEMS
router.get('/all-items', async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 3. EDIT ITEM
router.put('/item/:id', verifyToken, async (req, res) => {
    try {
        const { itemName, category, price, quantity } = req.body;
        const updatedStatus = Number(quantity) > 0 ? 'Available' : 'Out of Stock';
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { itemName, category, price: Number(price), quantity: Number(quantity), status: updatedStatus },
            { new: true }
        );
        return res.status(200).json(updatedItem);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 4. DELETE ITEM
router.delete('/item/:id', verifyToken, async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        return res.status(200).json("Item deleted successfully");
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 5. ADMIN: GET ALL USERS (Excluding Deleted and Admins)
// 5. ADMIN: GET ALL USERS
router.get('/admin/users', verifyToken, isAdmin, async (req, res) => {
    try {
        // Remove the { status: { $ne: 'deleted' } } filter
        const users = await User.find({ role: { $ne: 'admin' } }); 
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// 6. ADMIN: UPDATE USER STATUS (Deactivate/Delete)
router.put('/admin/user-status/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            { status: status }, 
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({ message: `User status changed to ${status}`, user: updatedUser });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;