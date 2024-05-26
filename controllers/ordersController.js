import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";

// @desc Create Order
// @route POST /api/v1/orders/create
// @access Private

export const createOrder = asyncHandler(async (req, res) => {
    // orderItems = [{id, quantity}], shippingAddress = {firstname, lastname, address}
    const {orderItems, shippingAddress} = req.body;

    // validation check of orderItems and shippingAddress
    if (!orderItems.length)
        return res.status(400).json({
            success: false,
            message: "Empty cart. Nothing to order"
        })

    if (!shippingAddress || !shippingAddress.firstname || !shippingAddress.lastname || !shippingAddress.address)
        return res.status(400).json({
            success: false,
            message: "Wrong type of shipping address info"
        })

    // if no product or ordered more than exists
    let totalPrice = 0;

    const productArray = [];
    for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.id);

        if (!product || !product.totalQuantity || product.totalQuantity < orderItems.quantity) {
            res.status(400).json({
                success: false,
                message: "No enough items of some products or there is no ordered item"
            })
        }
        totalPrice += product?.price * orderItem?.quantity || 0;

        // dont save it here. it will be better to save it after successful creation of order
        product.totalQuantity -= orderItems.quantity;
        product.totalSold += orderItems.quantity;

        productArray.push(product);
    }

    // auth validation
    const  {_id: userId} = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser)
        return res.status(403).json({
            success: false,
            message: "Bad authentification"
        })

    const newOrder = await new Order({
        user: userId,
        orderItems,
        shippingAddress,
        totalPrice
    }).save();

    existingUser.orders.push(newOrder);
    existingUser.save();

    for (const product of productArray) {
        await product.save();
    }

    // TODO: continue from 58 ep. 8 minute
})