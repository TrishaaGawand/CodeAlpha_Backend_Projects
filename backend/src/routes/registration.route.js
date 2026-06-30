const express = require("express");
const { registerForEvent, cancelRegistration, getMyRegistrations } = require("../controllers/registration.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// My registrations
router.get("/my", authMiddleware, getMyRegistrations);

// Register for event
router.post("/:id", authMiddleware, registerForEvent);

// Cancel registration
router.delete("/:id", authMiddleware, cancelRegistration);

module.exports = router;