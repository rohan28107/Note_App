const express = require('express');
const {NoteModel} = require('../model/Note.model');
const noteRouter = express.Router();

noteRouter.get("/", async(req, res) => {
    const user = req.body.userId
    const notes = await NoteModel.find({userId: user});

    res.send(notes);
})

noteRouter.post("/create", async(req, res) => {
    const payload = req.body;
    // try catch block
    try{
        const note = new NoteModel(payload);
        await note.save();
        res.send("Notes Created");
    }
    catch(err){
        console.log(err);
        res.send({"msg":"Something went wrong", "error":err.message});
    }
   
})


noteRouter.patch("/update/:id", async(req, res) => {
    const noteID = req.params.id;
    const payload = req.body;
    const note = await NoteModel.findOne({"_id":noteID})
    const userID_in_note = note.userId;
    const userID_making_req = req.body.userId;

    try{
        if(userID_making_req!==userID_in_note){
            req.send({"msg": "You are not authorized"})
        }else{
            await NoteModel.findByIdAndUpdate({_id: noteID}, payload);
            res.send({"msg": `Note with id ${noteID} has been updated`});
        }
    }
    catch(err) {
        res.send({"msg": `Note with id ${noteID} has not updated`, "error": err});
    }
})

noteRouter.delete("/delete/:id", async(req, res) => {
    const noteID = req.params.id;
    const note = await NoteModel.findOne({"_id":noteID})
    const userID_in_note = note.userId;
    const userID_making_req = req.body.userId;
    try{
        if(userID_making_req!==userID_in_note){
            req.send({"msg": "You are not authorized"})
        }else{
            await NoteModel.findByIdAndDelete({_id: noteID});
            res.send({"msg": `Note with id ${noteID} has been deleted`});
        }
    }
    catch(err) {
        res.send({"msg": `Note with id ${noteID} has not deleted`, "err": err});
    }
})

module.exports={
    noteRouter
}