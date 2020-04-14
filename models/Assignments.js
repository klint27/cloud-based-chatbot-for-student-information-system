const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssignmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    dateline: {
        type: Date,
        required: true
    },

    grades: [
        {
            value: {
                type: String,
                required: false
            },
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],

    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    }
});
module.exports = mongoose.model("assignments", AssignmentSchema);
