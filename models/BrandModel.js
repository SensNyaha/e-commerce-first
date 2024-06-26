import mongoose, {Schema} from "mongoose";

const BrandSchema = new Schema({
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

const Brand = mongoose.model("Brand", BrandSchema, "brands");

export default Brand;