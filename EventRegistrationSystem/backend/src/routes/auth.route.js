const express = require("express");
const { registerUser, loginUser, logoutUser, getCurrentUser } = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// get current user profile
router.get("/me", authMiddleware, getCurrentUser);

// Logout
router.post("/logout", authMiddleware, logoutUser);

module.exports = router;