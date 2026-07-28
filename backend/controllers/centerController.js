const MaternityCenter = require("../models/MaternityCenter");

// Register Maternity Center
const registerCenter = async (req, res) => {
    try {
        const center = await MaternityCenter.create(req.body);

        res.status(201).json({
            message: "Maternity Center Registered Successfully",
            center,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Centers
const getAllCenters = async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const centers = await MaternityCenter.find(filter);

        res.status(200).json(centers);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Single Center
const getCenterById = async (req, res) => {
    try {
        const center = await MaternityCenter.findById(req.params.id);

        if (!center) {
            return res.status(404).json({
                message: "Center not found",
            });
        }

        res.status(200).json(center);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Center
const updateCenter = async (req, res) => {
    try {
        const center = await MaternityCenter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(center);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Center Status (Admin)
const updateCenterStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const center = await MaternityCenter.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!center) {
            return res.status(404).json({ message: "Center not found" });
        }

        res.status(200).json({
            message: `Center status updated to ${status}`,
            center,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Center
const deleteCenter = async (req, res) => {
    try {
        await MaternityCenter.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Center Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    registerCenter,
    getAllCenters,
    getCenterById,
    updateCenter,
    updateCenterStatus,
    deleteCenter,
};