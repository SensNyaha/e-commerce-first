import asyncHandler from "express-async-handler";
import Category from "../models/CategoryModel.js";

// @desc Create a New Category
// @route POST /api/v1/categories/create
// @access Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, image } = req.body;
    const { _id: user } = req.body;

    const existingCategory = await Category.findOne({name});

    if (existingCategory) {
        return res.status(400).json({
            success: false,
            message: "Category already exists",
        })
    }

    const category = await new Category({
        name,
        user,
        image
    }).save();

    res.json({
        success: false,
        message: "Category created successfully",
        data: category
    })
})