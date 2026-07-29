const express = require('express');
const router = express.Router();
const MaternityCenter = require('../models/MaternityCenter');

// Get all approved centers
router.get('/', async (req, res) => {
    try {
        const centers = await MaternityCenter.find({ status: 'Approved' }).select('-password');
        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
