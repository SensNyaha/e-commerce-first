import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import Category from "../models/CategoryModel.js";
import Brand from "../models/BrandModel.js";
import Color from "../models/ColorModel.js";

// @desc Create New Product
// @route POST /api/v1/products/create
// @access Private/Admin

export const createProduct = asyncHandler(async (req, res) => {
    const { name, brand, description, category, sizes, colors, price, totalQuantity, images } = req.body;
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

    const existingCategory = await Category.findOne({name: category.toLowerCase()});

    if (!existingCategory)
        return res.status(400).json({
            success: false,
            message: "Category needs to be created first"
        })

    const existingBrand = await Brand.findOne({name: brand.toLowerCase()});

    if (!existingBrand)
        return res.status(400).json({
            success: false,
            message: "Brand needs to be created first"
        })

    if (Array.isArray(colors)) {
        for (const elem of colors) {
            const existingColor = await Color.findOne({name: elem.toLowerCase()});

            if (!existingColor)
                return res.status(400).json({
                    success: false,
                    message: "Color needs to be created first"
                })
        }
    }
    else {
        const existingColor = await Color.findOne({name: elem.toLowerCase()});

        if (!existingColor)
            return res.status(400).json({
                success: false,
                message: "Color needs to be created first"
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
        totalQuantity,
        images
    }).save();

    existingCategory.products.push(newProduct._id);
    await existingCategory.save();

    existingBrand.products.push(newProduct._id);
    await existingBrand.save();

    if (Array.isArray(colors)) {
        for (const elem of colors) {
            const existingColor = await Color.findOne({name: elem.toLowerCase()});
            existingColor.products.push(newProduct._id);
            await existingColor.save();
        }
    }
    else {
        const existingColor = await Color.findOne({name: elem.toLowerCase()});
        existingColor.products.push(newProduct._id);
        await existingColor.save();
    }

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

    const products = await Product.find(mongooseQuery).skip((page - 1) * limit).limit(limit).populate("reviews");

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

    const foundProduct = await Product.findById(id).populate("reviews");

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

    let previousCategory, previousBrand, newCategory, newBrand, colorsArray, deletedColors = [], newColors = [];

    if (category) {
        newCategory = await Category.findOne({name: category.toLowerCase()});

        if (!newCategory)
            return res.json({
                success: false,
                message: "Category needs to be created first"
            })

        if (category !== existingProduct.category) previousCategory = await Category.findOne({name: existingProduct.category.toLowerCase()});
    }

    if (brand) {
        newBrand = await Brand.findOne({name: brand.toLowerCase()});

        if (!newBrand)
            return res.json({
                success: false,
                message: "Brand needs to be created first"
            })

        if (brand !== existingProduct.brand) previousBrand = await Brand.findOne({name: existingProduct.brand.toLowerCase()});
    }

    if (colors) {
        if (!Array.isArray(colors)) colorsArray = [colors];
        else colorsArray = [...colors];

        for (const color of colorsArray) {
            if (!existingProduct.colors.includes(color.toLowerCase())) newColors.push(color.toLowerCase());
        }

        for (const color of existingProduct.colors) {
            if (!colorsArray.includes(color.toLowerCase())) deletedColors.push(color.toLowerCase());
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, {name, brand, description, category, sizes, colors, price, totalQuantity}, {new: true});

    if (previousCategory) {
        previousCategory.products = previousCategory.products.filter(elem => elem != id);
        await previousCategory.save();
        newCategory.products.push(id);
        await newCategory.save();
    }

    if (previousBrand) {
        previousBrand.products = previousBrand.products.filter(elem => elem != id);
        await previousBrand.save();
        newBrand.products.push(id);
        await newBrand.save();
    }

    if (deletedColors.length > 0) {
        for (const color of deletedColors) {
            const colorDoc = await Color.findOne({name: color.toLowerCase()});
            if (colorDoc) {
                colorDoc.products.splice(colorDoc.products.indexOf(updatedProduct._id), 1);
                await colorDoc.save();
            }
        }
    }

    if (newColors.length > 0) {
        for (const color of newColors) {
            const colorDoc = await Color.findOne({name: color.toLowerCase()});
            if (colorDoc) {
                colorDoc.products.push(updatedProduct._id);
                await colorDoc.save();
            }
        }
    }

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

    if (existingProduct.user != userId && !existingUserWithId.isAdmin) {
        return res.status(403).json({
            success: false,
            message: "You have no rights to delete this product"
        })
    }

    await Product.findByIdAndDelete(id);

    const categoryToUpdate = await Category.findOne({name: existingProduct.category.toLowerCase()});
    if (categoryToUpdate) {
        categoryToUpdate.products = categoryToUpdate.products.filter(elem => elem != id);
        await categoryToUpdate.save();
    }

    const brandToUpdate = await Brand.findOne({name: existingProduct.brand.toLowerCase()});
    if (brandToUpdate) {
        brandToUpdate.products = brandToUpdate.products.filter(elem => elem != id);
        await brandToUpdate.save();
    }

    if (existingProduct.colors.length > 0) {
        for (const color of existingProduct.colors) {
            const colorToUpdate = await Color.findOne({name: color.toLowerCase()});
            if (colorToUpdate) {
                colorToUpdate.products = colorToUpdate.products.filter(elem => elem != id);
                await colorToUpdate.save();
            }
        }
    }

    res.json({
        success: true,
        message: "You have successfully deleted product",
    })
})