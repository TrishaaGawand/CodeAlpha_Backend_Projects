const eventModel = require("../models/event.model");

async function createEvent(req, res) {
    try {

        const { title, description, date, location, capacity } = req.body;

        if(!title || !description || !date || !location || !capacity){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            capacity,
            availableSeats: capacity,
            organizer: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create event"
        })
    }
};

async function getAllEvents(req,res){
    try{

        const allevents=await eventModel.find.populate(
            "organizer",
            "name email"
        );
        
        res.status(200).json({
            success: true,
            count: allevents.length,
            events: allevents
        })
    }
    catch(error){
        console.log("Get all events error",error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get events"
        });
    }
};

async function getEventById(req,res){
    try{
        const event=await eventModel.findById(req.params.id).populate(
            "organizer",
            "name email"
        );
        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event Not Found"
            });
        }
        res.status(200).json({
            success: true,
            event
        });
    }
    catch(error){
        console.log("Get event by ID error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to get event"
        })
    };
}

async function updateEvent(req,res){
    try{    
        const event=await eventModel.findById(req.params.id);

        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }
        if(event.organizer.toString()!==req.user.id){
            return res.status(403).json({
                success: false,
                messgae: "You are not authorized"
            });
        }
        const updatedEvent=await eventModel.findIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event: updatedEvent
        });
    }
    catch(error){
        console.log("Update event error:",error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update event"
        });
    }
}

async function deleteEvent(req,res){
    try{
        const event =await eventModel.findById(req.params.id);
        
        if(!event){
            return res.status(404).json({
                success: false,
                message: "Event not found"
            })
        }
        if(event.organizer.toString()!== req.user.id){
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }
        await eventModel.findIdAndDelete(
            req.params.id
        );
        res.status(200).json({
            success: true,
            message: "Event deleted successfully" 
        });
    }
    catch(error){
        console.log("Delete event error:",error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete event"
        });
    }
};

module.exports={createEvent,getAllEvents,getEventById,updateEvent,deleteEvent};