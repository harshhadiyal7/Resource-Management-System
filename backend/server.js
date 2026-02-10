const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan'); 
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ["https://resource-management-system-frontend.onrender.com", "http://localhost:5173"], // Allow both live and local
  credentials: true
}));
app.use(morgan('dev')); 

// Database Connection with Error Handling
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:");
        console.error(err.message);
        process.exit(1); 
    });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/student', resourceRoutes);

// SEPARATE RESOURCE ROUTES
// This maps your separate logic files to specific URL paths
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resource/canteen', require('./routes/canteen'));
app.use('/api/resource/hostel', require('./routes/hostel'));
app.use('/api/resource/stationery', require('./routes/stationery'));

// General resource route (keep this if you still have shared resources)
app.use('/api/resource', require('./routes/resource'));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
    res.send("Campus Management System API is live and running!");
});
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));