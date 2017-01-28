var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Books = require('../models/books');
var booksRouter = express.Router();
booksRouter.use(bodyParser.json());

// GET all books and POST new books
booksRouter.route('/')
    // get all books
    .get(function(req, res, next) {
        Books.find({}, function(err, books) {
            if (err) next(err);
            res.json(books);
        });
    })
    // save a book
    .post(function(req, res, next) {
        Books.create(req.body, function(err, book) {
            if (err) next(err);

            var id = book._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });

            res.end('Saved the book with title ' + req.body.title);
        });
    });


// GET, PUT and DELETE individual books
booksRouter.route('/:id')
    // get specific book
    .get(function(req, res, next) {
        Books.findById(req.params.id, function(err, book) {
            if (err) next(err);
            res.json(book);
        });
    })
    // update a book
    .put(function(req, res, next) {
        Books.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {
            new: true
        }, function(err, book) {
            if (err) next(err);
            res.json(book);
        });
    })
    .delete(function(req, res, next) {
        Books.findById(req.params.id, function(err, book) {
            if (err) next(err);

            book.remove({});
            res.json(book);
        });
    });

// export router
module.exports = booksRouter;