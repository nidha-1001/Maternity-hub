const Booking = require("../models/Booking");

// Create Booking
const createBooking = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.body.user;
        const bookingData = {
            ...req.body,
            user: userId,
        };

        const booking = await Booking.create(bookingData);
        const populatedBooking = await Booking.findById(booking._id)
            .populate("user", "name email phone")
            .populate("center")
            .populate("service");

        res.status(201).json({
            message: "Booking Created Successfully",
            booking: populatedBooking,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Bookings (filtered by user if regular user)
const getAllBookings = async (req, res) => {
    try {
        let filter = {};
        if (req.user && req.user.role !== "admin") {
            filter.user = req.user._id;
        }

        const bookings = await Booking.find(filter)
            .populate("user", "name email phone")
            .populate("center")
            .populate("service")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Booking Status
const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("user", "name email phone")
            .populate("center")
            .populate("service");

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Booking
const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Booking Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    updateBooking,
    deleteBooking,
};