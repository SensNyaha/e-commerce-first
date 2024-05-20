import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    },
    accessToken: {
        type: String,
    }
}, {
    timestamps: true
})

UserSchema.pre("save", function(next) {
    if(this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
})

const User = mongoose.model("User", UserSchema, "users");

export default User;