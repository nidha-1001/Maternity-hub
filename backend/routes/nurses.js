const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HomeNurse = require('../models/HomeNurse');
const NurseBooking = require('../models/NurseBooking');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const localStore = require('../utils/localStore');

// @route   GET /api/nurses
// @desc    Get all approved nurses with optional filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { specialization, location, search } = req.query;

        if (mongoose.connection.readyState === 1) {
            let query = { verificationStatus: 'Approved' };

            if (specialization && specialization !== 'All') {
                query.specializations = { $in: [specialization] };
            }

            if (location && location !== 'All Locations') {
                query.serviceLocations = { $regex: location, $options: 'i' };
            }

            if (search) {
                query.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { bio: { $regex: search, $options: 'i' } },
                    { specializations: { $regex: search, $options: 'i' } },
                    { serviceLocations: { $regex: search, $options: 'i' } }
                ];
            }

            const nurses = await HomeNurse.find(query).sort({ rating: -1 });
            return res.json(nurses);
        }

        // Local store fallback
        const nurses = localStore.getAllNurses({ specialization, location, search });
        return res.json(nurses);
    } catch (error) {
        console.error('Fetch nurses error:', error);
        res.status(500).json({ message: error.message || 'Error fetching nurses' });
    }
});

// @route   GET /api/nurses/admin/all
// @desc    Get all nurses (admin)
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const nurses = await HomeNurse.find({}).sort({ createdAt: -1 });
            return res.json(nurses);
        }
        return res.json(localStore.getAllNurses());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/nurses/:id
// @desc    Get single nurse profile
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const nurse = await HomeNurse.findById(req.params.id);
            if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
            return res.json(nurse);
        }

        const nurse = localStore.findNurseById(req.params.id);
        if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
        return res.json(nurse);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/nurses/:id/status
// @desc    Approve or reject a nurse (Admin)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (mongoose.connection.readyState === 1) {
            const nurse = await HomeNurse.findByIdAndUpdate(
                req.params.id,
                { verificationStatus: status },
                { new: true }
            );
            if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
            return res.json({ message: `Nurse status updated to ${status}`, nurse });
        }

        const nurse = localStore.updateNurseStatus(req.params.id, status);
        if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
        return res.json({ message: `Nurse status updated to ${status}`, nurse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/nurses/:id
// @desc    Delete a nurse (Admin)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const nurse = await HomeNurse.findByIdAndDelete(req.params.id);
            if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
            return res.json({ message: 'Nurse removed successfully' });
        }
        localStore.deleteNurse(req.params.id);
        return res.json({ message: 'Nurse removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ==================== NURSE BOOKINGS ====================

// @route   POST /api/nurses/bookings
// @desc    Create a home nurse booking
// @access  Private
router.post('/bookings/create', protect, async (req, res) => {
    try {
        const { nurseId, shiftType, startDate, endDate, homeAddress, patientPhone, deliveryType, babyAgeDays, specialRequirements, totalAmount } = req.body;

        if (!nurseId || !shiftType || !startDate || !endDate || !homeAddress?.street || !homeAddress?.city) {
            return res.status(400).json({ message: 'Nurse, shift type, dates, street and city are required' });
        }

        const rawPhone = patientPhone || req.user.phone || '';
        const cleanPhone = String(rawPhone).replace(/\D/g, '').slice(-10);
        if (!cleanPhone || cleanPhone.length !== 10) {
            return res.status(400).json({ message: 'A valid 10-digit contact phone number is required' });
        }

        const parsedStart = new Date(startDate);
        const parsedEnd = new Date(endDate);

        if (isNaN(parsedStart.getTime()) || isNaN(parsedEnd.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        if (parsedStart < new Date()) {
            return res.status(400).json({ message: 'Start date must be in the future' });
        }

        if (parsedEnd < parsedStart) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        if (mongoose.connection.readyState === 1) {
            const nurse = await HomeNurse.findById(nurseId);
            if (!nurse) return res.status(404).json({ message: 'Nurse not found' });
            if (nurse.verificationStatus !== 'Approved') {
                return res.status(400).json({ message: 'This nurse is not currently available' });
            }

            const booking = await NurseBooking.create({
                user: req.user._id,
                nurse: nurse._id,
                shiftType,
                startDate: parsedStart,
                endDate: parsedEnd,
                homeAddress,
                patientPhone: cleanPhone,
                deliveryType: deliveryType || 'Not Applicable',
                babyAgeDays: babyAgeDays || null,
                specialRequirements: specialRequirements || '',
                totalAmount: totalAmount || 0,
                bookingStatus: 'Pending'
            });

            const populated = await NurseBooking.findById(booking._id)
                .populate('user', 'name email phone')
                .populate('nurse', 'name phone email specializations shiftTypes hourlyRate dailyRate qualification');

            return res.status(201).json({ message: 'Home nurse booked successfully', booking: populated });
        }

        // Local store fallback
        const nurse = localStore.findNurseById(nurseId);
        if (!nurse) return res.status(404).json({ message: 'Nurse not found' });

        const booking = localStore.createNurseBooking({
            user: { _id: req.user._id, name: req.user.name, email: req.user.email, phone: req.user.phone },
            nurse: { _id: nurse._id, name: nurse.name, phone: nurse.phone, email: nurse.email, specializations: nurse.specializations },
            shiftType,
            startDate: parsedStart.toISOString(),
            endDate: parsedEnd.toISOString(),
            homeAddress,
            patientPhone: cleanPhone,
            deliveryType: deliveryType || 'Not Applicable',
            babyAgeDays: babyAgeDays || null,
            specialRequirements: specialRequirements || '',
            totalAmount: totalAmount || 0,
            bookingStatus: 'Pending'
        });

        return res.status(201).json({ message: 'Home nurse booked successfully', booking });
    } catch (error) {
        console.error('Nurse booking error:', error);
        res.status(500).json({ message: error.message || 'Error creating nurse booking' });
    }
});

// @route   GET /api/nurses/bookings/my
// @desc    Get user's nurse bookings
// @access  Private
router.get('/bookings/my', protect, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const bookings = await NurseBooking.find({ user: req.user._id })
                .populate('nurse', 'name phone email specializations qualification hourlyRate dailyRate shiftTypes')
                .sort({ startDate: -1 });
            return res.json(bookings);
        }

        const bookings = localStore.getAllNurseBookings().filter(b =>
            b.user?._id === req.user._id || b.user?.email === req.user.email
        );
        return res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/nurses/bookings/all
// @desc    Get all nurse bookings (Admin)
// @access  Private/Admin
router.get('/bookings/all', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const bookings = await NurseBooking.find({})
                .populate('user', 'name email phone')
                .populate('nurse', 'name phone email specializations qualification')
                .sort({ createdAt: -1 });
            return res.json(bookings);
        }
        return res.json(localStore.getAllNurseBookings());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/nurses/bookings/:id/status
// @desc    Update nurse booking status (Admin)
// @access  Private/Admin
router.put('/bookings/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        }

        if (mongoose.connection.readyState === 1) {
            const booking = await NurseBooking.findByIdAndUpdate(
                req.params.id,
                { bookingStatus: status },
                { new: true }
            ).populate('user', 'name email').populate('nurse', 'name phone');

            if (!booking) return res.status(404).json({ message: 'Booking not found' });
            return res.json({ message: `Booking status updated to ${status}`, booking });
        }

        const updated = localStore.updateNurseBookingStatus(req.params.id, status);
        if (!updated) return res.status(404).json({ message: 'Booking not found' });
        return res.json({ message: `Booking status updated to ${status}`, booking: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/nurses/bookings/:id
// @desc    Cancel nurse booking (Owner or Admin)
// @access  Private
router.delete('/bookings/:id', protect, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const booking = await NurseBooking.findById(req.params.id);
            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to cancel this booking' });
            }

            await NurseBooking.findByIdAndDelete(req.params.id);
            return res.json({ message: 'Nurse booking cancelled successfully' });
        }

        const deleted = localStore.deleteNurseBooking(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Booking not found' });
        return res.json({ message: 'Nurse booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
