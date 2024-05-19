import mongoose from 'mongoose';
import {config} from "dotenv";

config();

export default async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`MongoDB Connected to ${connection.connection.host}`);
    } catch (e) {
        console.log(`MongoDB Connection Error: ${e}`);
        process.exit(1);
    }
}