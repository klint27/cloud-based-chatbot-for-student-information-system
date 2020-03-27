const mongoose = require("mongoose");
const { Schema } = mongoose;

// Create Schema
const AssignmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    grades: [
        {
           value: {
               type: Number,
               required: false
           },
           student:[
               {type: mongoose.Schema.Types.ObjectId,
               ref: 'users'}
               ]
        }
    ],

    dateline: {
        type: Date,
        required: false
    },

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    }

});

module.exports = User = mongoose.model("assignments", AssignmentSchema);