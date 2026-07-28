const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// Create Payment
const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);

        // Automatically update corresponding booking status to Accepted / Paid
        if (req.body.booking) {
            await Booking.findByIdAndUpdate(req.body.booking, {
                bookingStatus: "Accepted",
            });
        }

        res.status(201).json({
            message: "Payment Successful",
            payment,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Payments
const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate({
            path: "booking",
            populate: ["user", "center", "service"]
        });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createPayment,
    getAllPayments,
};