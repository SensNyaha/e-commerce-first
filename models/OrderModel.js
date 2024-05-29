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
        default: "Not Paid"
    },
    paymentMethod: {
        type: String,
        default: "Not specified"
    },
    totalPrice: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "Not specified"
    },
    status: {
        type: String,
        default: "Pending"
    },
    deliveredAt: {
        type: Date
    }
}, {timestamps: true})

const Order = mongoose.model("Order", OrderSchema, 'orders');

export default Order;