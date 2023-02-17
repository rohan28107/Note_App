const mongoose = require('mongoose');
// const dotenv = require('dotenv');
require('dotenv').config();

// const connection = mongoose.connect('mongodb://127.0.0.1:27017/notespsc');
const connection = mongoose.connect(process.env.MONGOURL);
// const connection = mongoose.connect('mongodb+srv://rohan:gajare@cluster0.71dd2ya.mongodb.net/notespsc?retryWrites=true&w=majority');


module.exports ={
    connection
}