const mongoose = require('mongoose');

const GymSchema = mongoose.Schema({
    gname: {
        type: String,
        required:true,
    },
    gcode: {
        type: String,
        required:true,
    },
});

module.exports = mongoose.model('gym',GymSchema,"gym");