const express = require('express');
const {UserModel} = require('../model/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userRouter = express.Router();


userRouter.post('/register', async(req, res) => {
    const {name, email, pass} = req.body;
    try{
        bcrypt.hash(pass, 5, async(err, hash) => {
            // Store hash in your password DB. hash means secured password
            if(err) res.send({"msg":"New User Not registered", "error": err.message});
            else{
                const user = new UserModel({name, email, pass:hash});
                await user.save();
                res.send({"msg":"New User Registered"});
            }
        });
    }
    catch(err){
        res.send({"msg":"New User Not registered", "error": err.message});
    }
})


userRouter.post('/login', async(req, res) => {
    const {email, pass} = (req.body);
    try{
        // const user = await UserModel.find({email, pass});
        const user = await UserModel.find({email});

        if(user.length > 0){
            bcrypt.compare(pass, user[0].pass, (err, result) => {
                // result == true
                if(result){
                    // let token  = jwt.sign({course:"backend"}, "masai");
                    let token  = jwt.sign({userId:user[0]._id}, "masai");
                    res.send({"msg":"Logged in successfully", "token": token});
                }else{
                    res.send({"msg":"New User Not logged"});
                }
            });
           
        }else{
            res.send({"msg":"Wrong credentials"});
        }
        
    }catch(err){
        res.send({"msg":"New User Not logged", "error": err.message});
    }
})

module.exports ={
    userRouter
}