const Service = require("../models/Service");

// Add Service
const addService = async (req, res) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            message: "Service Added Successfully",
            service,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Services (supports ?center=centerId filtering)
const getAllServices = async (req, res) => {
    try {
        const filter = {};
        if (req.query.center) {
            filter.center = req.query.center;
        }

        const services = await Service.find(filter).populate("center");

        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Service
const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Delete Service
const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Service Deleted Successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addService,
    getAllServices,
    updateService,
    deleteService,
};