const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const localStore = require('../utils/localStore');

// @route   GET /api/bookings/all
// @desc    Get all bookings for admin dashboard
// @access  Private/Admin
router.get('/all', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const bookings = await Booking.find({})
                .populate('user', 'name email phone')
                .populate('center', 'centerName address location')
                .populate('service', 'serviceName price duration')
                .sort({ createdAt: -1 });
            return res.json(bookings);
        }

        // Local store fallback
        return res.json(localStore.getAllBookings());
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ message: error.message || 'Error fetching bookings' });
    }
});

// @route   GET /api/bookings/my
// @desc    Get user bookings
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const bookings = await Booking.find({ user: req.user._id })
                .populate('center', 'centerName address location phone')
                .populate('service', 'serviceName price duration')
                .sort({ bookingDate: -1 });
            return res.json(bookings);
        }

        // Local store fallback
        const bookings = localStore.getAllBookings().filter(b => b.user?._id === req.user._id || b.user?.email === req.user.email);
        return res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
