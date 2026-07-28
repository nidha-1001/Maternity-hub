const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
    registerCenter,
    getAllCenters,
    getCenterById,
    updateCenter,
    deleteCenter,
} = require("../controllers/centerController");

router.post("/", registerCenter);
router.get("/", getAllCenters);
router.get("/:id", getCenterById);
router.put("/:id", protect, updateCenter);
router.delete("/:id", protect, authorize("admin"), deleteCenter);

module.exports = router;