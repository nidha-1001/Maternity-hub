const mongoose = require('mongoose');

const NurseBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nurse: { type: mongoose.Schema.Types.ObjectId, ref: 'HomeNurse', required: true },
    shiftType: {
        type: String,
        enum: ['Hourly Visit (2-4 hrs)', 'Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)', '24-hr Live-in'],
        required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    homeAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        landmark: { type: String },
        pincode: { type: String }
    },
    patientPhone: { type: String },
    deliveryType: { type: String, enum: ['Normal Delivery', 'C-Section', 'Not Applicable'], default: 'Not Applicable' },
    babyAgeDays: { type: Number },
    specialRequirements: { type: String },
    totalAmount: { type: Number, required: true },
    bookingStatus: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('NurseBooking', NurseBookingSchema);
