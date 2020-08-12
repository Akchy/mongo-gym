const express = require('express');
var validator = require("email-validator");
const router = express.Router();
const User = require('../models/User');
const Gym = require('../models/Gym');

router.get('/', async (req,res)=>{
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(err){
        res.json({message:err});
    }
})

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



router.post('/', async (req,res) => {
    const pass = req.body.pass;
    const len = pass.length;
    //console.log(len);
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