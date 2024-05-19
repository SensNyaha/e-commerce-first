import express from 'express';

import connectDB from "../config/connectDB.js";

connectDB();
const app = express();

export default app;