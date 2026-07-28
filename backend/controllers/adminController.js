const User = require("../models/User");
const MaternityCenter = require("../models/MaternityCenter");
const Booking = require("../models/Booking");

// Dashboard
const getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCenters = await MaternityCenter.countDocuments();
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            totalUsers,
            totalCenters,
            totalBookings,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getDashboard,
};