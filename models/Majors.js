const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("majors", MajorSchema);