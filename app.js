const express = require('express');
const app = express();
const postsRoute = require('./routers/posts');
const usersRoute = require('./routers/users');
const gymsRoute = require('./routers/gyms');
const bodyParser = require('body-parser');
var cronJob = require('node-cron');
const cors = require('cors');
require('dotenv/config');


//Midlewares
app.use(cors());
app.use(bodyParser.json());
app.use('/users',usersRoute);
app.use('/posts',postsRoute);
app.use('/gyms',gymsRoute);

//Home Page
app.get('/',(req,res) => {
    res.send("Welcome to Gym App");
})

//Reset Appointment everyday
cronJob.schedule("00 00 * * *", function() {
        Appoitment.remove({}); // Remove all the appointment after one day.
}, undefined, true,"Asia/Kolkata");


//Connect to DB
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true});

//Port Listen
app.listen(4500);
