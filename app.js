const express = require('express');
const app = express();
const postsRoute = require('./routers/posts');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');


app.use(cors());
app.use(bodyParser.json());

app.use('/posts',postsRoute);
app.get('/',(req,res) => {
    res.send("We are on Home");
})


const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_CONNECT, { useNewUrlParser: true ,useUnifiedTopology: true} , (error)=>{
    if(!error){
        console.log("Sucess connected");
    }
    else{
        console.log("Error Connecting to DB");
    }

});


app.listen(4500);
