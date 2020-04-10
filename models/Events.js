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
        type: String,
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

module.exports = mongoose.model("events", EventSchema);