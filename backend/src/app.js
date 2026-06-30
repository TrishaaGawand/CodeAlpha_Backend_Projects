const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route");
const eventRoutes = require("./routes/event.route");
const registrationRoutes = require("./routes/registration.route");

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Test route
app.get("/", (req, res) => {
    res.send("Event Registration API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

module.exports = app;