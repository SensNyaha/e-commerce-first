import mongoose, {Schema} from "mongoose";

const ReviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required'],
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required'],
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: 1,
        max: 5
    }
}, {timestamps: true})

const Review = mongoose.model("Review", ReviewSchema, "reviews");

export default Review