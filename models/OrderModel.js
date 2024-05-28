import mongoose, {Schema} from "mongoose";

const generateOrderNumber = () => Date.now() + Math.random().toString(36).toLocaleUpperCase();

const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            id: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            }
        }
    ],
    shippingAddress: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        postalCode: String,
        province: String,
        country: String,
        phone: String,
    },
    orderNumber: {
        type: String,
        default: generateOrderNumber,
        unique: true,
    },
    paymentStatus: {
        type: String,
        enum: ["Not Paid", "Payment was failed", "Successfully Paid"],
        default: "Not Paid"
    },
    paymentMethod: {
        type: String,
        enum: ["Not specified", "Credit Card", "Debet Card", "In Cash"],
        default: "Not specified"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        enum: ["Not specified", "$US", "€EU", "₽RU"],
        default: "Not specified"
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Cancelled", "Delayed", "Paid", "Shipped", "Delivered"],
        default: "Pending"
    },
    deliveredAt: {
        type: Date
    }
}, {timestamps: true})

const Order = mongoose.model("Order", OrderSchema, 'orders');

export default Order;