const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        data: Buffer,
        contentType: String
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: false
    }
});

module.exports = User = mongoose.model("events", EventSchema);