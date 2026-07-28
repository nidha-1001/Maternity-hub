const Review = require("../models/Review");

// Add Review
const addReview = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : req.body.user;
        const reviewData = {
            ...req.body,
            user: userId,
        };

        const review = await Review.create(reviewData);
        const populatedReview = await Review.findById(review._id)
            .populate("user", "name")
            .populate("center", "centerName");

        res.status(201).json({
            message: "Review Added Successfully",
            review: populatedReview,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Reviews (supports ?center=centerId filtering)
const getReviews = async (req, res) => {
    try {
        const filter = {};
        if (req.query.center) {
            filter.center = req.query.center;
        }

        const reviews = await Review.find(filter)
            .populate("user", "name")
            .populate("center", "centerName")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addReview,
    getReviews,
};