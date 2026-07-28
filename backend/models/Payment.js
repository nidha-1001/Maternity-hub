const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },

    amount: {
        type: Number,
        required: true,
    },

    paymentMethod: {
        type: String,
        default: "Online",
    },

    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending",
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Payment", paymentSchema);