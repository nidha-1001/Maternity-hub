const mongoose = require('mongoose');

const HomeNurseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    qualification: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    specializations: [{
        type: String,
        enum: ['Newborn Care', 'Postpartum Recovery', 'Lactation Support', 'C-Section Dressing', 'Night Care', 'Twin Care', 'Neonatal Care']
    }],
    serviceLocations: [{ type: String }],
    hourlyRate: { type: Number, required: true },
    dailyRate: { type: Number },
    shiftTypes: [{
        type: String,
        enum: ['Hourly Visit (2-4 hrs)', 'Day Shift (8 hrs)', 'Night Shift (10 PM - 6 AM)', '24-hr Live-in']
    }],
    bio: { type: String },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Approved'
    },
    rating: { type: Number, default: 4.8 },
    totalReviews: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('HomeNurse', HomeNurseSchema);
