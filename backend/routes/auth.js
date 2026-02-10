// backend/routes/auth.js
const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, contact } = req.body;

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).send("User already exists");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            contact
        });

        await newUser.save();
        return res.status(201).send("User created successfully");
    } catch (err) {
        return res.status(500).send(err.message);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Admin Hardcoded Check (Checks this first)
        if (email === "admin@gmail.com") {
            if (password === "Admin@123") {
                const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET);
                return res.status(200).json({ token, role: 'admin', name: "Admin" });
            }
            return res.status(401).json("Invalid Admin Credentials");
        }

        // 2. Fetch User from Database
        const user = await User.findOne({ email });

        // 3. Status Checks (Combines existence and deletion check)
        if (!user || user.status === 'deleted') {
            return res.status(404).json({ message: "User not exist" });
        }

        if (user.status === 'deactivated') {
            return res.status(403).json({ message: "Account is deactivated. Contact Admin." });
        }

        // 4. Password Verification using bcrypt
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json("Invalid Password");
        }

        // 5. Generate JWT and Respond
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            token,
            role: user.role,
            name: user.name
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/test', (req, res) => {
  res.json({ message: "Auth working" });
});

module.exports = router;