import asyncHandler from "express-async-handler";
import Brand from "../models/BrandModel.js";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Color from "../models/ColorModel.js";

// @desc Create a New Brand
// @route POST /api/v1/brands/create
// @access Private/Admin
export const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const { _id: user } = req.body;

    const existingBrand = await Brand.findOne({name});

    if (existingBrand) {
        return res.status(400).json({
            success: false,
            message: "Brand already exists",
        })
    }

    const brand = await new Brand({
        name: name.toLowerCase(),
        user,
    }).save();

    res.json({
        success: false,
        message: "Brand created successfully",
        data: brand
    })
})

// @desc Get all Brands
// @route GET /api/v1/brands
// @access Public

export const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();

    res.json({
        success: true,
        message: "Brands fetched successfully",
        data: brands
    })
})

// @desc Get Single Brand
// @route GET /api/v1/brands/:id
// @access Public

export const getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const existingBrand = await Brand.findById(id);

    if (!existingBrand)
        return res.status(404).json({
            success: false,
            message: "Brand with the same ID was not found"
        })

    res.json({
        success: true,
        message: "Brand fetched successfully",
        data: existingBrand
    })
})

// @desc Update Brand by its ID
// @route PUT /api/v1/brands/:id
// @access Private/Admin

export const updateBrandById = asyncHandler(async (req, res) => {
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

    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
        return res.status(404).json({
            success: false,
            message: "Brand with the same ID can not be found"
        })
    }

    const existingBrandWithName = await Brand.findOne({name: name.toLowerCase()});

    if (existingBrandWithName) {
        return res.status(400).json({
            success: false,
            message: "Brand with the same name already exists"
        })
    }

    const existingUserWithId = await User.findById(userId);

    if (existingBrand.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to change this brand's info"
        })

    const newProductsField = [...existingBrand.products];

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


    const updatedBrand = await Brand.findByIdAndUpdate(existingBrand._id,{name: name.toLowerCase(), products: newProductsField}, {new: true});
    res.json({
        success: true,
        message: "You have successfully updated brand's info",
        data: updatedBrand
    })
})

// @desc Delete Single Brand
// @route DELETE /api/brands/:id
// @access Private/Admin

export const deleteBrandById = asyncHandler(async (req, res) => {
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

    const existingBrand = await Brand.findById(id);

    if (!existingBrand) {
        return res.status(404).json({
            success: false,
            message: "Brand with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);


    if (existingBrand.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to delete this category"
        })

    await Brand.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "You have successfully delete brand",
    })
})