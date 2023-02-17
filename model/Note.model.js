const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    title: String,
    body: String,
    userId: String
})

const NoteModel = mongoose.model('note', noteSchema)


module.exports = {
    NoteModel
}
