const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const UserSchema = new Schema({
     first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },

    major:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'majors'
    }],

    classes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    }]
});

module.exports = User = mongoose.model("users", UserSchema);