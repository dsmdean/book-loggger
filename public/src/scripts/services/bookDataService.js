(function() {
    'use strict';

    function bookDataService($q, $timeout, $http, constants, $cacheFactory, cacheService) {

        function sendResponseData(response) {
            return response.data;
        }

        function sendGetBooksError(response) {
            return $q.reject('Error retrieving book(s). (HTTP status: ' + response.status + ')');
        }

        function getAllBooks() {
            return $http({
                    method: 'GET',
                    url: constants.APP_SERVER + '/api/books',
                    cache: true
                })
                .then(sendResponseData)
                .catch(sendGetBooksError);
        }

        function getBookByID(bookID) {
            return $http.get(constants.APP_SERVER + '/api/books/' + bookID)
                .then(sendResponseData)
                .catch(sendGetBooksError);
        }

        function updateBookSuccess(response) {
            return 'Book updated: ' + response.config.data.title;
        }

        function updateBookError(response) {
            return $q.reject('Error updating book. (HTTP status: ' + response.status + ')');
        }

        function updateBook(book) {

            cacheService.deleteAllBooksResponseFromCache();
            cacheService.deleteSummaryFromCache();

            return $http({
                    method: 'PUT',
                    url: constants.APP_SERVER + '/api/books/' + book._id,
                    data: book
                })
                .then(updateBookSuccess)
                .catch(updateBookError);
        }

        function addBookSucces(response) {
            return 'Book added: ' + response.config.data.title;
        }

        function addBookError(response) {
            return $q.reject('Error adding book. (HTTP status: ' + response.status + ')');
        }

        function addBook(newBook) {

            cacheService.deleteAllBooksResponseFromCache();
            cacheService.deleteSummaryFromCache();

            return $http.post(constants.APP_SERVER + '/api/books', newBook)
                .then(addBookSucces)
                .catch(addBookError);
        }

        function deleteBookSuccess(response) {
            return 'Book deleted.';
        }

        function deleteBookError(response) {
            return $q.reject('Error deleting book. (HTTP status: ' + response.status + ')');
        }

        function deleteBook(bookID) {

            cacheService.deleteAllBooksResponseFromCache();
            cacheService.deleteSummaryFromCache();

            return $http({
                    method: 'DELETE',
                    url: constants.APP_SERVER + '/api/books/' + bookID
                })
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        }

        return {
            getAllBooks: getAllBooks,
            getBookByID: getBookByID,
            updateBook: updateBook,
            addBook: addBook,
            deleteBook: deleteBook
        };
    }

    angular.module('app')
        .factory('bookDataService', ['$q', '$timeout', '$http', 'constants', '$cacheFactory', 'cacheService', bookDataService]);

}());