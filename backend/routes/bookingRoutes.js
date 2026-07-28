const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
    createBooking,
    getAllBookings,
    updateBooking,
    deleteBooking,
} = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/", protect, getAllBookings);
router.put("/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

module.exports = router;