const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const ClassSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'courses'
    },

});

module.exports = User = mongoose.model("classes", ClassSchema);