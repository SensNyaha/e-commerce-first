import Review from '../models/ReviewModel.js';
import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

// @desc Create new Review
// @route POST /api/v1/reviews/:productID
// @access Private/Admin

export const createReview = asyncHandler(async (req, res) => {
    const { message, rating } = req.body;

    const { _id: userId } = req.body;

    const { productID } = req.params;

    const existingProduct = await Product.findById(productID).populate("reviews");

    if (!existingProduct)
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })

    if (existingProduct.reviews.find(async rev => rev.user == userId)) {
        return res.status(400).json({
            success: false,
            message: "User already commented this product"
        })
    }

    const newReview = await new Review({
        message,
        rating,
        product: existingProduct._id,
        user: userId
    }).save();

    existingProduct.reviews.push(newReview._id);

    await existingProduct.save();

    res.json({
        success: true,
        message: "Review created successfully",
        data: newReview
    })
})

// @desc Delete a Review
// @route DELETE /api/v1/reviews/:reviewID
// @access Private/Admin

export const deleteReview = asyncHandler(async (req, res) => {
    const { _id: userId } = req.body;

    const { reviewID } = req.params;

    const existingUser = await User.findById(userId);

    if (!existingUser)
        return res.status(400).json({
            success: false,
            message: "Wrong Auth"
        })

    const existingReview = await Review.findById(reviewID);

    if (!existingReview)
        return res.status(404).json({
            success: false,
            message: "Review does not exist"
        })

    const existingProduct = await Product.findById(existingReview.product);

    if (!existingProduct)
        return res.status(404).json({
            success: false,
            message: "Product of the review not found"
        })

    if (existingReview.user != userId && !existingUser.isAdmin) {
        return res.status(400).json({
            success: false,
            message: "You have no rights to delete this review"
        })
    }

    await existingReview.deleteOne();

    existingProduct.reviews = existingProduct.reviews.filter(rev => rev != existingReview._id);
    await existingProduct.save();

    res.json({
        success: true,
        message: "Review deleted successfully",
    })
})
