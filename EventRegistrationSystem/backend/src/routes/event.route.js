const express = require("express");
const { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/event.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// Get all events
router.get("/", getAllEvents);

// Get single event
router.get("/:id", getEventById);

// Create event
router.post("/", authMiddleware, createEvent);

// Update event
router.put("/:id", authMiddleware, updateEvent);

// Delete event
router.delete("/:id", authMiddleware, deleteEvent);

module.exports = router;