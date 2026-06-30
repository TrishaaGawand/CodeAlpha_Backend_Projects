const registrationModel = require("../models/registration.model");
const eventModel = require("../models/event.model");

async function registerForEvent(req, res) {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await eventModel.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.availableSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: "No seats available"
            });
        }

        const alreadyRegistered = await registrationModel.findOne({
            user: userId,
            event: eventId,
            status: "registered" 
        });

        if (alreadyRegistered) {
            return res.status(400).json({
                success: false,
                message: "Already registered for this event"
            });
        }

    
        const cancelledRegistration = await registrationModel.findOne({
            user: userId,
            event: eventId,
            status: "cancelled"
        });

        let registration;

        if (cancelledRegistration) {
            cancelledRegistration.status = "registered";
            registration = await cancelledRegistration.save();
        }else {
            registration = await registrationModel.create({
                user: userId,
                event: eventId,
                status: "registered" 
            });
        }

        event.availableSeats -= 1;
        await event.save();

        res.status(201).json({
            success: true,
            message: "Registration successful",
            registration
        });

    }
    catch (error) {
        console.log("Register for event error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to register for event"
        });
    }
}

async function cancelRegistration(req, res) {
    try {
        const registration = await registrationModel.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: "Registration not found"
            });
        }
        
        if (registration.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Registration already cancelled"
            });
        }

        registration.status = "cancelled";
        await registration.save();

        const event = await eventModel.findById(registration.event);

        if (event) {
            event.availableSeats += 1;
            await event.save();
        }

        res.status(200).json({
            success: true,
            message: "Registration cancelled successfully",
            registration
        });

    }
    catch (error) {
        console.log("Cancel registration error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to cancel registration"
        });
    }
}

async function getMyRegistrations(req, res) {
    try {
        const registrations = await registrationModel.find({
            user: req.user.id,
            status: "registered"
        })
            .populate("event") 
            .populate("user", "name email"); 
        
        const cancelledRegistrations = await registrationModel.find({
            user: req.user.id,
            status: "cancelled"
        })
            .populate("event")
            .populate("user", "name email");

        res.status(200).json({
            success: true,
            count: registrations.length,
            registrations,
            cancelled: cancelledRegistrations 
        });

    } 
    catch (error) {
        console.log("Get my registrations error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get registration"
        });
    }
}

module.exports = {registerForEvent,cancelRegistration,getMyRegistrations};