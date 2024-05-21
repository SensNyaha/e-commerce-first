import User from "../models/UserModel.js";
import PasswordValidator from "password-validator";
import bcrypt from "bcrypt";

import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import verifyToken from "../utils/verifyToken.js";
import privateRouteHandler from "../middlewares/privateRouteHandler.js";

// @desc Registration of User
// @route POST /api/v1/users/register
// @access Public

export const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, passwordConfirmation} = req.body;

    // check passwords equal
    if (password !== passwordConfirmation && password) {
        return res.status(401).json({
            success: false,
            message: "Passwords don't match",
        })
    }

    // password validation
    const passwordSchema = new PasswordValidator();

    passwordSchema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().digits(1)
        .has().not().spaces();

    if (!passwordSchema.validate(password)) {
        return res.status(401).json({
            success: false,
            message: "Too weak password",
        })
    }

    // check existing user
    const existingUser = await User.findOne({
        $or: [
            {username},
            {email}
        ]
    });

    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "User with the same email or username already exists"
        })
    }

    // creating new user
    const {username: usernameResult, email: emailResult, _id, orders, wishlists, isAdmin} = await new User({username, email, password}).save();

    res.json({
        success: true,
        message: "User created successfully",
        data: {username: usernameResult, email: emailResult, _id, orders, wishlists, isAdmin},
    })
})

// @desc Login User
// @route POST /api/v1/users/login
// @access Public

export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    // check all the fields were provided
    if (!email || !password) {
        return res.status(401).json({
            success: false,
            message: "Email or password don't exist",
        })
    }

    // find existing user with this email
    const existingUser = await User.findOne({email});
    // if user with the same email was not found
    if (!existingUser) {
        return res.status(401).json({
            success: false,
            message: "User with the same email and password pair doesn't exist",
        })
    }
    // comparing passwords
    if (!await bcrypt.compare(password, existingUser.password)) {
        return res.status(401).json({
            success: false,
            message: "User with the same email and password pair doesn't exist",
        })
    }

    existingUser.accessToken = generateToken(existingUser._id);

    const tokenedUser = await existingUser.save();

    // convert document to an Object to remove password field
    const objectedUser = tokenedUser.toObject();
    delete objectedUser.password;

    res.json({
        success: true,
        message: "User login successfully",
        data: objectedUser
    })
})

// @desc Get User Profile
// @route GET /api/v1/users/profile
// @access Private

export const getUserProfile = asyncHandler( async (req, res) => {
    const {_id} = req.body;

    const existingUser = await User.findById(_id).select("-password");

    if (!existingUser) {
        return res.status(403).json({
            success: false,
            message: "Authentication failed",
        })
    }

    return res.status(200).json({
        success: true,
        message: "Operation ran successfully",
        data: existingUser
    })
})