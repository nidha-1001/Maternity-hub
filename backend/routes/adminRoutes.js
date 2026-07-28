const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { getDashboard } = require("../controllers/adminController");
const { updateCenterStatus } = require("../controllers/centerController");

router.get("/dashboard", protect, authorize("admin"), getDashboard);
router.put("/center-status/:id", protect, authorize("admin"), updateCenterStatus);

module.exports = router;