const express = require('express');
const router = express.Router();
const Gym = require('../models/Gym');


//Owner Add timing
router.patch('/addtiming', async (req,res) => {
    const gcode_var = req.body.gcode;
    const gExist = await Gym.find({
        gcode:gcode_var
    }).countDocuments();
    const timeExist = await Gym.find({
        "time.stime":req.body.stime,
    }).countDocuments();
    if(gExist==1 && timeExist==0){
        try{
            await Gym.updateOne({
                gcode: gcode_var,
            },
            {
                $push:{
                    time:{
                        "stime":req.body.stime,
                        "etime":req.body.etime,
                        "count":0,
                        "limit":req.body.limit,
                    }
                }
            });
            res.send("Added");
        }
        catch(err){
            res.json({message:err});
        }
    }
    else if(timeExist==1)
        res.send("Time Already Exist");
    else   
        res.send("Error");
        
});

//Owner Delete timing
router.patch('/deltiming', async (req,res) => {
    const gcode_var = req.body.gcode;
    const gExist = await Gym.find({
        gcode:gcode_var,
    }).countDocuments();
    if(gExist==1){
        try{
            await Gym.updateOne({
                gcode: gcode_var,
            },
            {
                $pull:{
                    time:{"stime":req.body.stime,}
                }
            });
            res.send("Deleted");
        }
        catch(err){
            res.json({message:err});
        }
    }
});


/*router.get('/', async (req,res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }
    catch(err){
        res.json({message:err});
    }
});

router.post('/', async (req,res) => {
    const post = new Post({
        title: req.body.title,
        desc: req.body.desc
    })

    try{
        const savedPost = await post.save()
        res.json(savedPost);
    }
    catch(err){
        res.json({message:err});
    }
        
});

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
});
*/

module.exports =router;