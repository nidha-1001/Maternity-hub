const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
    createPayment,
    getAllPayments,
} = require("../controllers/paymentController");

router.post("/", protect, createPayment);
router.get("/", protect, getAllPayments);

module.exports = router;