import mongoose, {Schema} from "mongoose";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
    }],
    wishlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wishlist"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    shippingAddress: {
        firstName: String,
        lastName: String,
        address: String,
        city: String,
        postalCode: String,
        province: String,
        country: String,
        phone: String,
    }
}, {
    timestamps: true
})

const User = mongoose.model("User", UserSchema, "users");

export default User;