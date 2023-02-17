const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    pass: String
})

const UserModel = mongoose.model('user', userSchema)
// user is a collection name

module.exports = {
    UserModel
}
