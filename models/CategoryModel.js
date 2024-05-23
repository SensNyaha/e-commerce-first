import mongoose, {Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    image: {
        type: String,
        default: "https://picsum.photos/200/300",
        required: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    ]
}, {timestamps: true})

const Category  = mongoose.model("Category", CategorySchema, "categories");

export default Category;