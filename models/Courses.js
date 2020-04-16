const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    major: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'majors'
    }
});

module.exports = mongoose.model("courses", CourseSchema);