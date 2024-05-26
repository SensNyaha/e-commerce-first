import mongoose, {Schema} from "mongoose";

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        ref: "Category",
        required: true,
    },
    sizes: {
        type:[String],
        enum: ["No-Size", "S", "M", "L", "XL", "XXL"],
        required: true,
    },
    colors: {
        type: [String],
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    images: [
        {
            type: String,
            default: "https://via.placeholder.com/150",
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    price: {
        type: Number,
        required: true,
    },
    totalQuantity: {
        type: Number,
        required: true,
    },
    totalSold: {
        type: Number,
        required: true,
        default: 0,
    }
},
    {
        timestamps: true,
        toJSON: {virtuals: true},
    }
)

ProductSchema.virtual("avgRating").get(function() {
    if (Array.isArray(this?.reviews))
        return (this?.reviews.reduce((sum, elem) => sum + elem.rating, 0) / this.reviews.length).toFixed(1);
})

const Product = mongoose.model("Product", ProductSchema, "products");

export default Product;