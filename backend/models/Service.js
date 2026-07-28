const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
{
    center: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MaternityCenter",
        required: true,
    },

    serviceName: {
        type: String,
        required: true,
    },

    description: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    duration: {
        type: String,
    },

    availability: {
        type: Boolean,
        default: true,
    }
},
{
    timestamps: true,
}
);

module.exports = mongoose.model("Service", serviceSchema);