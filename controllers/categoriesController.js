import asyncHandler from "express-async-handler";
import Category from "../models/CategoryModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

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

// @desc Get all Categories
// @route GET /api/v1/categories
// @access Public

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    res.json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
    })
})

// @desc Get Single Category
// @route GET /api/v1/categories/:id
// @access Public

export const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingCategory = await Category.findById(id);

    if (!existingCategory)
        return res.status(404).json({
            success: false,
            message: "Category with the same ID was not found"
        })

    res.json({
        success: true,
        message: "Category fetched successfully",
        data: existingCategory
    })
})

// @desc Update Category by its ID
// @route PUT /api/v1/categories/:id
// @access Private/Admin

export const updateCategoryById = asyncHandler(async (req, res) => {
    const {name, image, products: bodyProducts} = req.body;
    // user _id inserted my middleware
    const {_id: userId} = req.body;
    // product id provided by params
    const {id} = req.params;

    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "User does not logged in",
        })
    }

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
        return res.status(404).json({
            success: false,
            message: "Category with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);

    if (existingCategory.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to change this products's info"
        })

    const newProductsField = [...existingCategory.products];

    bodyProducts.split(",").forEach((el, i) => {
        if (el.startsWith("+")) {
            const indexInOldField = newProductsField.findIndex(inner => el.substring(1) == inner);
            if (indexInOldField === -1) {
                newProductsField.push(el.substring(1));
            }
        }
        else if (el.startsWith("-")) {
            const indexInOldField = newProductsField.findIndex(inner => el.substring(1) == inner);
            if (indexInOldField !== -1) {
                newProductsField.splice(indexInOldField, 1);
            }
        }
        else
            return res.json({
                success: false,
                message: "Wrong products list formation. You must provide products with its ID and mask `+ID` to add or `-ID` to remove the product from category"
            })
    })

    const updatedCategory = await Category.findByIdAndUpdate(existingCategory._id,{name, image, products: newProductsField}, {new: true});

    res.json({
        success: true,
        message: "You have successfully updated category's info",
        data: updatedCategory
    })
})

// @desc Delete Single Category
// @route DELETE /api/categories/:id
// @access Private/Admin

export const deleteCategoryById = asyncHandler(async (req, res) => {
    // user _id inserted my middleware
    const {_id: userId} = req.body;
    // product id provided by params
    const {id} = req.params;

    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "User does not logged in",
        })
    }

    const existingCategory = await Category.findById(id);

    if (!existingCategory) {
        return res.status(404).json({
            success: false,
            message: "Category with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);


    if (existingCategory.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to delete this category"
        })

    await Category.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "You have successfully delete category",
    })
})