const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    longUrl: {
        type: String,
        required: [true, 'Long URL is required'],
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date
    }
});

urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

const urlModel = mongoose.model('URL', urlSchema);
module.exports = urlModel;