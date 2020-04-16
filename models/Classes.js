const mongoose = require("mongoose");
const { Schema } = mongoose;

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

module.exports = mongoose.model("classes", ClassSchema);