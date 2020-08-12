const express = require('express');
var validator = require("email-validator");
const router = express.Router();
const User = require('../models/User');
const Gym = require('../models/Gym');
const Appt = require('../models/Appointment');


//Login
router.get('/:username&:pass', async (req,res) => {
    try{
        const valid = await User.find({
            email: req.params.username,
        }).countDocuments();
        if(valid == 1){
            const check = await User.find({
                email: req.params.username,
                pass: req.params.pass
            }).countDocuments();
            if(check==1)
                res.send("Logged in")
            else    
                res.send("Incorrect Password")
        }
        if(valid == 0)
            res.send("Not Exist");
    }
    catch(err){
        res.json({message:err});
    }
});


//Sign-up
router.post('/', async (req,res) => {
    const pass = req.body.pass;
    const len = pass.length;
    const gExist = await Gym.find({
        gcode:req.body.gcode,
    }).countDocuments();
      
    if(validator.validate(req.body.email) && len>=6 && gExist==1)
    {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            pass: req.body.pass,
            phone: req.body.phone,
            gcode: req.body.gcode,
            appointment:false,
        })

        try{
            const savedUser = await user.save()
            res.json(savedUser);
        }
        catch(err){
            res.json({message:err});
        }
    }
    else if(gExist==0){
        res.send("Enter valid Gym Code");
    }
    else{
        res.send("Enter valid Email and password");
    }

});

//get the gym timing
router.get('/gymtiming/:gcode', async (req,res)=>{
    try{
        const timing = await Gym.find({
            gcode:req.params.gcode,
        },{
            time:1,
            _id:0,
        });
        res.json(timing);
    }catch (err){
        res.json({message:err})
    }
});


//Appointment
router.post('/appointment', async (req,res) => {
    const gExist = await Gym.find({
        gcode:req.body.gcode,
    }).countDocuments();
    const userExist = await User.find({
        email:req.body.email,
    }).countDocuments();
      
    if(userExist==1 && gExist==1){
        // check if the given timing has slot left
        const available = await Gym.find({
            gcode:req.body.gcode,
            "time.stime":req.body.stime,
            $expr:{
                $gte:[ "$time.limit","$time.count"]
            }
        }).countDocuments(); 

        if(available==1){
            const appt = new Appt({
                email: req.body.email,
                code: req.body.gcode,
                stime: req.body.stime,
                etime: req.body.etime,
            });
            //Increment the value from Gym count
            await Gym.updateOne({
                gcode:req.body.gcode,
                "time.stime":req.body.stime,
            },{
                $inc: { "time.$.count":1}
            });

            //change the field in user profile
            await User.updateOne({
                email:req.body.email
            },{
               $set:{
                   appointment:true
               } 
            });

            try{
                await appt.save()
                res.send("Appointment Made");
            }
            catch(err){
                res.json({message:err});
            }
        }
        else{
            res.send("Limit Exeeded");
        }        
    }
    else{
        if(gExist==0){
            res.send("Enter valid Gym Code");
        }
        if(userExist==0)
            res.send("Enter valid Email ID");
    }
});

/*
router.get('/:postId', async(req,res)=>{
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }catch(err){
        res.json({message:err});
    }
});

router.delete('/:postId',async(req,res)=>{
    try{
        const removedPost = await Post.deleteOne({_id: req.params.postId});
        res.json(removedPost);
    }catch(err){
        res.json({message:err});
    }
});

router.patch('/:postId',async (req,res)=> {
    try{
        const updatedPost = await Post.updateOne({_id: req.params.postId},{$set: {title: req.body.title }});
        res.json(updatedPost);
    }catch(err){
        res.json({message:err});
    }
});*/


module.exports =router;