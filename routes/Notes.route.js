const express = require('express');
const {NoteModel} = require('../model/Note.model');
const noteRouter = express.Router();


/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           properties:
*               id:
*                   type: string
*                   description: The auto-generated id of the user
*               name:
*                   type: string
*                   description: The user name
*               email:
*                   type: string
*                   description: The user email
*/

/**
* @swagger
* tags:
*   name: Users
*   description: All the API routes related to User
*/

/**
* @swagger
* /users:
*   get:
*       summary: This will get all the user data from the database
*       tags: [Users]
*       responses:
*           200:
*               description: The list of all the users
*               content:
*                   application/json:
*                       schema:
*                           type: array
*                           item:
*                               $ref: "#/components/schemas/User"
*
*/
noteRouter.get("/", async(req, res) => {
    const user = req.body.userId
    const notes = await NoteModel.find({userId: user});

    res.send(notes);
})

/**
* @swagger
* /users/create:
*   post:
*       summary: To post the details of a new user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The user was successfully registered
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           500:
*               description: Some server error
*/
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


/**
* @swagger
* /users/update/{id}:
*   patch:
*       summary: It will update the user details
*       tags: [Users]
*       parameters:
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The book id
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The user Deatils has been updated
*               content:
*                   application/json:
*                       schema:
*                       $ref: '#/components/schemas/User'
*           404:
*               description: The user was not found
*           500:
*               description: Some error happened
*/

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


/**
* @swagger
* /users/delete/{id}:
*   delete:
*       summary: Remove the user by id
*       tags: [Users]
*       parameters:
*               name: id
*               schema:
*                   type: string
*               required: true
*               description: The user id
*
*       responses:
*           200:
*               description: The user was deleted
*           404:
*               description: The user was not found
*/
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