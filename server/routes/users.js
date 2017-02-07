// grab the things we need
var express = require('express');
var userRouter = express.Router();
var passport = require('passport');

// import models
var User = require('../models/users');
var Verify = require('./verify');

// get all users
userRouter.get('/', function(req, res, next) {
    User.find({}, function(err, user) {
        if (err) next(err);
        res.json(user);
    });
});

// // register user
userRouter.post('/register', function(req, res) {
    User.register(new User({ username: req.body.username }),
        req.body.password,
        function(err, user) {
            if (err) {
                return res.status(500).json({ err: err });
            }

            if (req.body.admin) {
                user.admin = req.body.admin;
            }
            if (req.body.firstname) {
                user.firstname = req.body.firstname;
            }
            if (req.body.lastname) {
                user.lastname = req.body.lastname;
            }

            user.save(function(err, user) {
                passport.authenticate('local')(req, res, function() {
                    return res.status(200).json({ status: 'Registration Successful!' });
                });
            });
        });
});

// log user in
userRouter.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                err: info
            });
        }
        req.logIn(user, function(err) {
            if (err) {
                return res.status(500).json({
                    err: 'Could not log in user'
                });
            }

            // console.log('User in users: ', user);

            var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });

            res.status(200).json({
                status: 'Login Successful!',
                succes: true,
                token: token,
                user: user
            });
        });
    })(req, res, next);
});

userRouter.get('/logout', Verify.verifyOrdinaryUser, function(req, res) {
    //console.log('logout');
    req.logout();
    res.status(200).json({
        status: 'Bye!'
    });
});

userRouter.route('/:userId')
    // get a specific user
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);
            res.json(user);
        });
    })
    // update a specific user
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findByIdAndUpdate(req.params.userId, {
            $set: req.body
        }, {
            new: true
        }, function(err, user) {
            if (err) next(err);
            res.json(user);
        });
    })
    // delete a specific user
    .delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.remove({});
            res.json(user);
        });
    });

userRouter.route('/:userId/totalMinutesRead')
    // update total_minutes_read from a specific user
    .put(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            user.total_minutes_read += req.body.minutes_read;
            user.save(function(err, user) {
                if (err) next(err);

                res.json('Updated minutes read. Username: ' + user.username);
            });
        });
    });

userRouter.route('/:userId/booksRead')
    // get books read from a specific user
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId)
            .populate('booksRead')
            .exec(function(err, user) {
                if (err) next(err);

                res.json(user.booksRead);
            });
    })
    // save book read for a specific user
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            if (user.booksRead.indexOf(req.body.bookID) === -1) {
                user.booksRead.push(req.body.bookID);
                user.save(function(err, user) {
                    if (err) next(err);

                    res.json('Added the book to books read. ID: ' + req.body.bookID);
                });
            } else {
                res.json('The book is already in the Read Books list. ID: ' + req.body.bookID);
            }
        });
    });

userRouter.route('/:userId/booksRead/:bookId')
    // delete a specific book in book read list from a specific user
    .delete(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            if (user.booksRead.indexOf(req.params.bookId) !== -1) {
                user.booksRead.splice(user.booksRead.indexOf(req.params.bookId), 1);

                user.save(function(err, user) {
                    if (err) next(err);

                    res.json('Deleted the book from books read. ID: ' + req.params.bookId);
                });
            } else {
                res.json('Book not deleted from books read (book not in books read list). ID: ' + req.params.bookId);
            }
        });
    });

userRouter.route('/:userId/favoriteBooks')
    // get books read from a specific user
    .get(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId)
            .populate('favoriteBooks')
            .exec(function(err, user) {
                if (err) next(err);

                res.json(user.favoriteBooks);
            });
    })
    // save book read for a specific user
    .post(Verify.verifyOrdinaryUser, function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            if (user.favoriteBooks.indexOf(req.body.bookID) === -1) {
                user.favoriteBooks.push(req.body.bookID);
                user.save(function(err, user) {
                    if (err) next(err);

                    res.json('Added the book to favorites. ID: ' + req.body.bookID);
                });
            } else {
                res.json('The book is already in the favorites list. ID: ' + req.body.bookID);
            }
        });
    });

userRouter.route('/:userId/favoriteBooks/:bookId')
    // delete a specific book in favorties book from a specific user
    .delete(function(req, res, next) {
        User.findById(req.params.userId, function(err, user) {
            if (err) next(err);

            if (user.favoriteBooks.indexOf(req.params.bookId) !== -1) {
                user.favoriteBooks.splice(user.favoriteBooks.indexOf(req.params.bookId), 1);

                user.save(function(err, user) {
                    if (err) next(err);

                    res.json('Deleted the book from favorites. ID: ' + req.params.bookId);
                });
            } else {
                res.json('Book not deleted from favorites (book not in favorites list). ID: ' + req.params.bookId);
            }
        });
    });

// export router
module.exports = userRouter;