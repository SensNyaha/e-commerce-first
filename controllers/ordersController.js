import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Product from "../models/ProductModel.js";
import Order from "../models/OrderModel.js";

// @desc Create Order
// @route POST /api/v1/orders/create
// @access Private

export const createOrder = asyncHandler(async (req, res) => {
    // orderItems = [{id, quantity}], shippingAddress = {firstName, lastName, address}
    const {orderItems} = req.body;

    // validation check of orderItems and shippingAddress
    if (!orderItems.length)
        return res.status(400).json({
            success: false,
            message: "Empty cart. Nothing to order"
        })

    let totalPrice = 0;

    // if no product or ordered more than exists
    const productArray = [];
    for (const orderItem of orderItems) {
        const product = await Product.findById(orderItem.id);

        if (!product || !product.totalQuantity || product.totalQuantity < orderItem.quantity) {
            return res.status(400).json({
                success: false,
                message: "No enough items of some products or there is no ordered item"
            })
        }
        totalPrice += product?.price * orderItem?.quantity || 0;

        // dont save it here. it will be better to save it after successful creation of order
        product.totalQuantity -= orderItem.quantity;
        product.totalSold += orderItem.quantity;

        productArray.push(product);
    }

    // auth validation
    const  {_id: userId} = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser)
        return res.status(403).json({
            success: false,
            message: "Bad authentication"
        })

    let userShippingAddress = true;
    let {shippingAddress} = existingUser;

    if (JSON.stringify(shippingAddress) === "{}") {
        userShippingAddress = false;
    }

    if (!userShippingAddress) {
        shippingAddress = req.body?.shippingAddress;
    }

    if (!shippingAddress)
        return res.status(400).json({
            success: false,
            message: "Please add shipping address to your account or use custom one for this order"
        })

    if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address)
        return res.status(400).json({
            success: false,
            message: "Wrong type of shipping address info"
        })

    const newOrder = await new Order({
        user: userId,
        orderItems,
        shippingAddress,
        totalPrice
    }).save();

    existingUser.orders.push(newOrder);

    if (!userShippingAddress)
        existingUser.shippingAddress = shippingAddress;

    await existingUser.save();

    for (const product of productArray) {
        await product.save();
    }

    res.json({
        success: true,
        message: "Order created successfully",
        data: newOrder
    })
})