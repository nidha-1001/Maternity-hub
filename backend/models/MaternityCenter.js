const mongoose = require("mongoose");

const maternityCenterSchema = new mongoose.Schema(
{
    centerName: {
        type: String,
        required: true,
    },

    ownerName: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("MaternityCenter", maternityCenterSchema);