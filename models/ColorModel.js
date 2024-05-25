import mongoose, {Schema} from "mongoose";

const ColorModel = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
}, {timestamps: true})

const Color = mongoose.model("Color", ColorModel, "colors");

export default Color;