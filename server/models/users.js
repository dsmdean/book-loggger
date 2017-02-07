// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

//create a users Schema
var User = new Schema({
    username: String,
    password: String,
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    weekly_reading_goal: {
        type: Number,
        default: 0
    },
    total_minutes_read: {
        type: Number,
        default: 0
    },
    booksRead: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }],
    favoriteBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Books'
    }],
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// create model
User.plugin(passportLocalMongoose);

// export model
module.exports = mongoose.model('User', User);