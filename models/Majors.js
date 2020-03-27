const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const MajorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

module.exports = User = mongoose.model("majors", MajorSchema);