import Router from "express";
import express from "express";
import Stripe from "stripe";
import {config} from "dotenv";
import Order from "../models/OrderModel.js";

config();

const webHookRouter = Router();

const endpointSecret = process.env.WEBHOOK_SIGN_SECRET;
const stripe = new Stripe(process.env.STRIPE_SK);

webHookRouter.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const {orderId} = session.metadata;

        const paymentStatus = session.payment_status;
        const paymentMethod = session.payment_method_types[0];
        const totalAmount = session.amount_total;
        const currency = session.currency;

        await Order.findByIdAndUpdate(orderId, {paymentStatus, paymentMethod, currency}, {new: true});
    } else {
        return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
});

export default webHookRouter