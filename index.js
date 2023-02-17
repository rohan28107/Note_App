const express = require('express');
const swaggerJSdoc=require("swagger-jsdoc")
const swaggerUi=require("swagger-ui-express")

const {connection} = require("./db");
const {userRouter} = require('./routes/User.routes');
const {noteRouter} = require('./routes/Notes.route');
const {authenticate} = require('./middlewares/authenticate.middleware');
const cors = require("cors");

// const dotenv = require('dotenv');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
// app.use(cors({
//     origin:"*"
// }))

app.get('/', (req, res) => {
    res.send("Home page");
})

const options={
        definition:{
            openapi:"3.0.0",
            info:{
                title:"Learning Swagger",
                version:"1.0.0"
            },
            servers:[
                {
                url:"http://localhost:8080"
                }
            ]
            },
            apis:["./routes/*.js"]
    }
const swaggerSpec=swaggerJSdoc(options)
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

app.use("/users", userRouter);
app.use(authenticate);
app.use("/notes", noteRouter);

app.listen(process.env.PORT, async()=> {
    try{
        await connection
        console.log("Connected to DB");
    }
    catch(err){
        console.log(err.message);
    }
    console.log(`Server is running on port ${process.env.PORT}`);
})