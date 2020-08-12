const mongoose = require('mongoose');

const GymTimingSchema = mongoose.Schema({
    stime:{
        type:String,
        required:true,
    },
    etime:{
        type:String,
        required:true,
    },
    count:{
        type:String,
        required:true,
    }
});

const GymSchema = mongoose.Schema({
    gname: {
        type: String,
        required:true,
    },
    gcode: {
        type: String,
        required:true,
    },
    time:[GymTimingSchema],
});

module.exports = mongoose.model('gym',GymSchema,"gym");