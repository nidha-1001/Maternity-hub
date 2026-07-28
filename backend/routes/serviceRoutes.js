const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    addService,
    getAllServices,
    updateService,
    deleteService,
} = require("../controllers/serviceController");

router.post("/", protect, addService);
router.get("/", getAllServices);
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;