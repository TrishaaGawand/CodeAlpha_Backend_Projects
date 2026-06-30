const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

async function registerUser(req, res) {
    try {

        const { name, email, password, role } = req.body;

        const isUserAlreadyExists = await userModel.findOne({
            email
        });

        if (isUserAlreadyExists) {
            res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const userRole=role==="organizer"? "organizer":"attendee";
        console.log("Saving user with role:",userRole);

        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            role: userRole
        });

        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.log("Registration Error: ", error);
        res.status(500).json({
            success: false,
            message: error.message || "Registration Failed"
        });
    }
};

async function loginUser(req, res) {
    try {

        const { name, email, password } = req.body;

        const user = await userModel.findOne({
            $or: [
                { name },
                { email }
            ]
        })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password) //password converted into hashing and then compared

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const token = generateToken(user);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    }
    catch (error) {
        console.log("Login error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Login failed"
        });
    }
}

async function logoutUser(req, res) {
    try {
        res.clearCookie("token");

        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
}

async function getCurrentUser(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        });

    }
    catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get user"
        });
    }
}
module.exports = {
    registerUser, loginUser, logoutUser, getCurrentUser
};