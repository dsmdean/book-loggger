// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a books Schema
var booksSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year_published: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// create model
var Books = mongoose.model('Books', booksSchema);

// export model
module.exports = Books;