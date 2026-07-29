const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    center: { type: mongoose.Schema.Types.ObjectId, ref: "MaternityCenter", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    bookingDate: { type: Date, required: true },
    bookingStatus: { type: String, enum: ["Pending", "Accepted", "Rejected", "Completed"], default: "Pending" },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
