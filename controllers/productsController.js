import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

// @desc Create New Product
// @route POST /api/v1/products/create
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, description, category, sizes, colors, price, totalQuantity } = req.body;
    // user _id inserted my middleware
    const { _id } = req.body;

    if (!_id) {
        return res.status(403).json({
            success: false,
            message: "User does not logged in",
        })
    }

    if (!name || !description || !category || !sizes || !sizes.length || !colors || !colors.length || !price || !totalQuantity) {
        return res.status(400).json({
            success: false,
            message: "Sorry. You did not provide enough info about new product"
        })
    }

    const existingProduct = await Product.findOne({ name });

    if (existingProduct) {
        return res.status(400).json({
            success: false,
            message: "Product with the same name already exist",
        })
    }

    const newProduct = await new Product({
        name,
        description,
        brand,
        category,
        sizes,
        colors,
        user: _id,
        price,
        totalQuantity
    }).save();

    return res.status(200).json({
        success: true,
        message: "New Product created successfully",
        data: newProduct
    })
})