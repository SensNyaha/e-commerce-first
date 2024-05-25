import asyncHandler from "express-async-handler";
import Color from "../models/ColorModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";

// @desc Create a New Color
// @route POST /api/v1/colors/create
// @access Private/Admin
export const createColor = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { _id: user } = req.body;

    const existingColor = await Color.findOne({name});

    if (existingColor) {
        return res.status(400).json({
            success: false,
            message: "Color already exists",
        })
    }

    const color = await new Color({
        name: name.toLowerCase(),
        user,
    }).save();

    res.json({
        success: false,
        message: "Color created successfully",
        data: color
    })
})

// @desc Get all Colors
// @route GET /api/v1/colors
// @access Public

export const getColors = asyncHandler(async (req, res) => {
    const colors = await Color.find();

    res.json({
        success: true,
        message: "Colors fetched successfully",
        data: colors
    })
})

// @desc Get Single Color
// @route GET /api/v1/colors/:id
// @access Public

export const getColorById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingColor = await Color.findById(id);

    if (!existingColor)
        return res.status(404).json({
            success: false,
            message: "Color with the same ID was not found"
        })

    res.json({
        success: true,
        message: "Color fetched successfully",
        data: existingColor
    })
})

// @desc Update Color by its ID
// @route PUT /api/v1/colors/:id
// @access Private/Admin

export const updateColorById = asyncHandler(async (req, res) => {
    const {name, products: bodyProducts} = req.body;
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

    const existingColor = await Color.findById(id);

    if (!existingColor) {
        return res.status(404).json({
            success: false,
            message: "Color with the same ID can not be found"
        })
    }

    const existingColorWithName = await Color.findOne({name: name.toLowerCase()});

    if (existingColorWithName) {
        return res.status(400).json({
            success: false,
            message: "Color with the same name already exists"
        })
    }

    const existingUserWithId = await User.findById(userId);

    if (existingColor.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to change this color's info"
        })

    const newProductsField = [...existingColor.products];

    if (bodyProducts) {
        for (const el of bodyProducts.split(",")) {
            if (el.startsWith("+")) {
                const indexInOldField = newProductsField.findIndex(inner => el.substring(1) == inner);
                if (indexInOldField === -1) {
                    const product = await Product.findById(el.substring(1))
                    if (product) newProductsField.push(el.substring(1));
                }
            }
            else if (el.startsWith("-")) {
                const indexInOldField = newProductsField.findIndex(inner => el.substring(1) == inner);
                if (indexInOldField !== -1) {
                    newProductsField.splice(indexInOldField, 1);
                }
            }
            else
                res.json({
                    success: false,
                    message: "Wrong products list formation. You must provide products with its ID and mask `+ID` to add or `-ID` to remove the product from category"
                });

        }
    }


    const updatedColor = await Color.findByIdAndUpdate(existingColor._id,{name: name.toLowerCase(), products: newProductsField}, {new: true});
    res.json({
        success: true,
        message: "You have successfully updated color's info",
        data: updatedColor
    })
})

// @desc Delete Single Color
// @route DELETE /api/colors/:id
// @access Private/Admin

export const deleteColorById = asyncHandler(async (req, res) => {
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

    const existingColor = await Color.findById(id);

    if (!existingColor) {
        return res.status(404).json({
            success: false,
            message: "Color with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);


    if (existingColor.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to delete this category"
        })

    await Color.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "You have successfully delete color",
    })
})