import Review from '../models/ReviewModel.js';
import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

// @desc Create new Review
// @route POST /api/v1/reviews/create
// @access Private/Admin

export const createReview = asyncHandler(async (req, res) => {
    const { message, rating } = req.body;

    const { _id: userId } = req.body;

    const { productID } = req.params;

    const existingProduct = await Product.findById(productID);

    if (!existingProduct)
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })

    if (existingProduct.reviews.find(async rev => (await Review.findById(rev))?.user == userId)) {
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
