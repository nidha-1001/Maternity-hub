const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MaternityCenter = require('../models/MaternityCenter');
const Service = require('../models/Service');
const Review = require('../models/Review');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const localStore = require('../utils/localStore');

// @route   GET /api/centers
// @desc    Get approved centers with optional search and location filter
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search, location } = req.query;

        if (mongoose.connection.readyState === 1) {
            let query = { status: 'Approved' };

            if (location && location !== 'All Locations') {
                query.location = { $regex: location, $options: 'i' };
            }

            if (search) {
                query.$or = [
                    { centerName: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } }
                ];
            }

            const centers = await MaternityCenter.find(query).select('-password').lean();

            const centersWithRatings = await Promise.all(
                centers.map(async (center) => {
                    const reviews = await Review.find({ center: center._id });
                    const avgRating = reviews.length > 0
                        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
                        : 4.8;
                    
                    return {
                        ...center,
                        rating: avgRating,
                        reviewsCount: reviews.length
                    };
                })
            );

            return res.json(centersWithRatings);
        }

        // Local store fallback
        const approvedCenters = localStore.findCenters({ search, location }).filter(c => c.status === 'Approved');
        return res.json(approvedCenters);
    } catch (error) {
        console.error('Fetch centers error:', error);
        res.status(500).json({ message: error.message || 'Error fetching centers' });
    }
});

// @route   GET /api/centers/admin/all
// @desc    Get all centers regardless of status (Admin only)
// @access  Private/Admin
router.get('/admin/all', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const centers = await MaternityCenter.find({}).select('-password').sort({ createdAt: -1 });
            return res.json(centers);
        }

        // Local store fallback
        return res.json(localStore.getAllCenters());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/centers/:id
// @desc    Get single center by ID with its services & reviews
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const center = await MaternityCenter.findById(req.params.id).select('-password').lean();
            if (!center) {
                return res.status(404).json({ message: 'Maternity center not found' });
            }

            const services = await Service.find({ center: center._id });
            const reviews = await Review.find({ center: center._id }).populate('user', 'name');

            const avgRating = reviews.length > 0
                ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
                : 4.9;

            return res.json({
                ...center,
                rating: avgRating,
                reviewsCount: reviews.length,
                services,
                reviews
            });
        }

        // Local store fallback
        const center = localStore.findCenterById(req.params.id);
        if (!center) {
            return res.status(404).json({ message: 'Maternity center not found' });
        }
        return res.json(center);
    } catch (error) {
        console.error('Fetch center detail error:', error);
        res.status(500).json({ message: error.message || 'Error fetching center details' });
    }
});

// @route   PUT /api/centers/:id/status
// @desc    Approve or reject a maternity center (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (mongoose.connection.readyState === 1) {
            const center = await MaternityCenter.findById(req.params.id);
            if (!center) {
                return res.status(404).json({ message: 'Maternity center not found' });
            }

            center.status = status;
            await center.save();

            return res.json({ message: `Center status updated to ${status}`, center });
        }

        // Local store fallback
        const center = localStore.updateCenterStatus(req.params.id, status);
        if (!center) {
            return res.status(404).json({ message: 'Maternity center not found' });
        }
        return res.json({ message: `Center status updated to ${status}`, center });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/centers/:id
// @desc    Update maternity center profile
// @access  Private (Provider / Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const center = await MaternityCenter.findById(req.params.id);
            if (!center) {
                return res.status(404).json({ message: 'Maternity center not found' });
            }

            if (req.user.role !== 'admin' && center.email !== req.user.email) {
                return res.status(403).json({ message: 'Not authorized to update this center profile' });
            }

            const { centerName, phone, address, location, description } = req.body;
            if (centerName) center.centerName = centerName;
            if (phone) center.phone = phone;
            if (address) center.address = address;
            if (location) center.location = location;
            if (description) center.description = description;

            await center.save();
            return res.json(center);
        }

        // Local store fallback
        const center = localStore.updateCenter(req.params.id, req.body);
        if (!center) {
            return res.status(404).json({ message: 'Maternity center not found' });
        }
        return res.json(center);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/centers
// @desc    Add a new maternity center (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { centerName, ownerName, email, password, phone, address, location, description, status } = req.body;

        if (!centerName || !ownerName || !email || !phone || !address || !location) {
            return res.status(400).json({ message: 'Center Name, Owner Name, Email, Phone, Address, and Location are required' });
        }

        const rawPassword = password || 'provider123';

        if (mongoose.connection.readyState === 1) {
            const existingCenter = await MaternityCenter.findOne({ email });
            if (existingCenter) {
                return res.status(400).json({ message: 'A maternity center with this email already exists' });
            }

            const center = await MaternityCenter.create({
                centerName,
                ownerName,
                email,
                password: rawPassword,
                phone,
                address,
                location,
                description: description || 'Certified maternity care center.',
                status: status || 'Approved'
            });

            const existingUser = await User.findOne({ email });
            if (!existingUser) {
                await User.create({
                    name: ownerName,
                    email,
                    password: rawPassword,
                    phone,
                    role: 'provider'
                });
            }

            return res.status(201).json({
                message: 'Maternity center created successfully',
                center
            });
        }

        // Local store fallback
        const existingCenter = localStore.findCenterByEmail(email);
        if (existingCenter) {
            return res.status(400).json({ message: 'A maternity center with this email already exists' });
        }

        const center = await localStore.createCenter({
            centerName,
            ownerName,
            email,
            password: rawPassword,
            phone,
            address,
            location,
            description: description || 'Certified maternity care center.',
            status: status || 'Approved'
        });

        await localStore.createUser({
            name: ownerName,
            email,
            password: rawPassword,
            phone,
            role: 'provider'
        });

        return res.status(201).json({
            message: 'Maternity center created successfully',
            center
        });
    } catch (error) {
        console.error('Create center error:', error);
        res.status(500).json({ message: error.message || 'Error creating maternity center' });
    }
});

// @route   DELETE /api/centers/:id
// @desc    Delete a maternity center (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const center = await MaternityCenter.findById(req.params.id);
            if (!center) {
                return res.status(404).json({ message: 'Maternity center not found' });
            }

            await Service.deleteMany({ center: center._id });
            await MaternityCenter.findByIdAndDelete(req.params.id);

            return res.json({ message: 'Maternity center removed successfully' });
        }

        // Local store fallback
        localStore.deleteCenter(req.params.id);
        return res.json({ message: 'Maternity center removed successfully' });
    } catch (error) {
        console.error('Delete center error:', error);
        res.status(500).json({ message: error.message || 'Error deleting maternity center' });
    }
});

module.exports = router;
