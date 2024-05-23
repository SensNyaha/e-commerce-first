import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

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
            message: "Product with the same name already exists",
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

// @desc Get All Products
// @route GET /api/v1/products
// @access Public

export const getProducts = asyncHandler(async (req, res) => {

    const {name, brands, sizes, colors, categories, priceFrom, priceUpto} = req.query;

    let {page, limit} = req.query;

    const mongooseQuery = {};

    if (name) mongooseQuery.name = { "$regex": name, "$options": "i" };
    if (brands) mongooseQuery.brand = { "$in": brands.split(",").map(brand => new RegExp(brand, "i"))};
    if (sizes) mongooseQuery.sizes = { "$in": sizes.split(",").map(size => new RegExp(size, "i"))};
    if (colors) mongooseQuery.colors = { "$in": colors.split(",").map(color => new RegExp(color, "i"))};
    if (categories) mongooseQuery.category = { "$in": categories.split(",").map(cat => new RegExp(cat, "i"))};

    if (priceUpto && priceFrom) mongooseQuery.price = {$gte: priceFrom, $lte: priceUpto};
    else if (priceUpto && !priceFrom) mongooseQuery.price = {$lte: priceUpto};
    else if (!priceUpto && priceFrom) mongooseQuery.price = {$gte: priceFrom};

    if (!page) page = 1;
    if (!limit) limit = 10;

    const totalDocs = await Product.countDocuments();

    const products = await Product.find(mongooseQuery).skip((page - 1) * limit).limit(limit);

    if (!products.length)
        return res.status(404).json({
            success: false,
            message: "No Products to show",
            total: totalDocs
        })

    res.json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        total: totalDocs
    })
})

// @desc Get Single Product
// @route GET /api/v1/products/:id
// @access Public

export const getProductById = asyncHandler(async (req, res) => {
    const {id} = req.params;

    if (!id)
        return res.status(400).json({
            success: false,
            message: "No ID provided with request"
        })

    const foundProduct = await Product.findById(id);

    if (!foundProduct)
        return res.status(404).json({
            success: false,
            message: "Product with the same ID can not be found"
        })

    res.json({
        success: true,
        message: `Product ${id} successfully found`,
        data: foundProduct
    })
})

// @desc Update Single Product
// @route PUT /api/products/:id
// @access Private/Admin

export const updateProductById = asyncHandler(async (req, res) => {
    const {name, brand, description, category, sizes, colors, price, totalQuantity} = req.body;
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

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
        return res.status(404).json({
            success: false,
            message: "Product with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);


    if (existingProduct.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to change this products's info"
        })

    const updatedProduct = await Product.findByIdAndUpdate(id, {name, brand, description, category, sizes, colors, price, totalQuantity}, {new: true});

    res.json({
        success: true,
        message: "You have successfully updated product's info",
        data: updatedProduct
    })
})

// @desc Delete Single Product
// @route DELETE /api/products/:id
// @access Private/Admin

export const deleteProductById = asyncHandler(async (req, res) => {
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

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
        return res.status(404).json({
            success: false,
            message: "Product with the same ID can not be found"
        })
    }

    const existingUserWithId = await User.findById(userId);


    if (existingProduct.user != userId && !existingUserWithId.isAdmin)
        return res.status(403).json({
            success: false,
            message: "You have no rights to delete this product"
        })

    await Product.findByIdAndDelete(id);

    res.json({
        success: true,
        message: "You have successfully delete product",
    })
})