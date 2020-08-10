const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
    },
    phone: {
        type: String,
        required:true,
    },
    pass: {
        type: String,
        required:true,
    },
    gcode: {
        type: String,
        required:true,
    },
});

module.exports = mongoose.model('user',UserSchema,"user");