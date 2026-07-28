const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
} = require("../controllers/userController");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.get("/", protect, authorize("admin"), getAllUsers);

module.exports = router;