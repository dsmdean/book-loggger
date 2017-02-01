(function() {
    'use strict';

    function dataService($q, $timeout, $http, constants, $cacheFactory) {

        function deleteSummaryFromCache() {
            var dataCache = $cacheFactory.get('bookLoggerCache');
            dataCache.remove('summary');
        }

        function deleteAllBooksResponseFromCache() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(constants.APP_SERVER + '/api/books');
        }

        function deleteAllUsersResponseFromCache() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(constants.APP_SERVER + '/api/users');
        }

        function transformGetBooks(data, headersGetter) {

            var transformed = angular.fromJson(data);

            transformed.forEach(function(currentValue, index, array) {
                currentValue.dateDownloaded = new Date();
            });

            // console.log(transformed);
            return transformed;
        }

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
                    headers: {
                        'PS-BookLogger-Version': constants.APP_VERSION
                    },
                    transformResponse: transformGetBooks,
                    cache: true
                })
                .then(sendResponseData)
                .catch(sendGetBooksError);
        }

        function getReadBooks(userID) {
            return $http({
                    method: 'GET',
                    url: constants.APP_SERVER + '/api/users/' + userID + '/booksRead',
                    cache: true
                })
                .then(sendResponseData)
                .catch(sendGetBooksError);
        }

        function addReadBookSucces(response) {
            return 'Book added to read list.';
        }

        function addReadBookError(response) {
            return $q.reject('Error adding book to favorite. (HTTP status: ' + response.status + ')');
        }

        function addReadBook(userID, book) {

            return $http.post(constants.APP_SERVER + '/api/users/' + userID + '/booksRead', book)
                .then(addReadBookSucces)
                .catch(addReadBookError);
        }

        function getFavoriteBooks(userID) {
            return $http({
                    method: 'GET',
                    url: constants.APP_SERVER + '/api/users/' + userID + '/favoriteBooks',
                    cache: true
                })
                .then(sendResponseData)
                .catch(sendGetBooksError);
        }

        function addFavoriteBookSucces(response) {
            return 'Book added to favorite.';
        }

        function addFavoriteBookError(response) {
            return $q.reject('Error adding book to favorite. (HTTP status: ' + response.status + ')');
        }

        function addFavoriteBook(userID, book) {

            return $http.post(constants.APP_SERVER + '/api/users/' + userID + '/favoriteBooks', book)
                .then(addFavoriteBookSucces)
                .catch(addFavoriteBookError);
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

            deleteAllBooksResponseFromCache();
            deleteSummaryFromCache();

            return $http({
                    method: 'PUT',
                    url: constants.APP_SERVER + '/api/books/' + book._id,
                    data: book
                })
                .then(updateBookSuccess)
                .catch(updateBookError);
        }

        function transformPostRequest(data, headersGetter) {
            data.newBook = true;
            // console.log(data);

            return JSON.stringify(data);
        }

        function addBookSucces(response) {
            return 'Book added: ' + response.config.data.title;
        }

        function addBookError(response) {
            return $q.reject('Error adding book. (HTTP status: ' + response.status + ')');
        }

        function addBook(newBook) {

            deleteAllBooksResponseFromCache();
            deleteSummaryFromCache();

            return $http.post(constants.APP_SERVER + '/api/books', newBook, {
                    transformRequest: transformPostRequest
                })
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

            deleteAllBooksResponseFromCache();
            deleteSummaryFromCache();

            return $http({
                    method: 'DELETE',
                    url: constants.APP_SERVER + '/api/books/' + bookID
                })
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        }

        function getReadersSuccess(response) {
            return response.data;
        }

        function getReadersError(response) {
            return $q.reject('Error retrieving user(s). (HTTP status: ' + response.status + ')');
        }

        function getAllReaders() {
            return $http({
                    method: 'GET',
                    url: constants.APP_SERVER + '/api/users',
                    cache: true
                })
                .then(getReadersSuccess)
                .catch(getReadersError);
        }

        function sendGetUserError(response) {
            return $q.reject('Error retrieving user(s). (HTTP status: ' + response.status + ')');
        }

        function getUserByID(userID) {
            return $http.get(constants.APP_SERVER + '/api/users/' + userID)
                .then(sendResponseData)
                .catch(sendGetUserError);
        }

        function updateUserSuccess(response) {
            return 'User updated: ' + response.config.data.username;
        }

        function updateUserError(response) {
            return $q.reject('Error updating user. (HTTP status: ' + response.status + ')');
        }

        function updateUser(user) {

            deleteAllUsersResponseFromCache();
            deleteSummaryFromCache();

            return $http({
                    method: 'PUT',
                    url: constants.APP_SERVER + '/api/users/' + user._id,
                    data: user
                })
                .then(updateUserSuccess)
                .catch(updateUserError);
        }

        function getUserSummary() {
            var deferred = $q.defer();

            var dataCache = $cacheFactory.get('bookLoggerCache');

            if (!dataCache) {
                dataCache = $cacheFactory('bookLoggerCache');
            }

            var summaryFromCache = dataCache.get('summary');

            if (summaryFromCache) {
                // console.log('returning summary from cache');
                deferred.resolve(summaryFromCache);
            } else {
                // console.log('gathering new summary data');

                var booksPromise = getAllBooks();
                var readersPromise = getAllReaders();

                $q.all([booksPromise, readersPromise])
                    .then(function(bookLoggerData) {

                        var allBooks = bookLoggerData[0];
                        var allReaders = bookLoggerData[1];

                        var grandTotalMinutes = 0;

                        allReaders.forEach(function(currentReader, index, array) {
                            grandTotalMinutes += currentReader.total_minutes_read;
                        });

                        var summaryData = {
                            bookCount: allBooks.length,
                            readerCount: allReaders.length,
                            grandTotalMinutes: grandTotalMinutes
                        };

                        dataCache.put('summary', summaryData);

                        deferred.resolve(summaryData);
                    });
            }

            return deferred.promise;
        }

        return {
            getAllBooks: getAllBooks,
            getAllReaders: getAllReaders,
            getBookByID: getBookByID,
            getUserByID: getUserByID,
            updateBook: updateBook,
            updateUser: updateUser,
            addBook: addBook,
            deleteBook: deleteBook,
            getReadBooks: getReadBooks,
            addReadBook: addReadBook,
            getFavoriteBooks: getFavoriteBooks,
            addFavoriteBook: addFavoriteBook,
            getUserSummary: getUserSummary,
            deleteSummaryFromCache: deleteSummaryFromCache,
            deleteAllUsersResponseFromCache: deleteAllUsersResponseFromCache
        };
    }

    angular.module('app')
        .factory('dataService', ['$q', '$timeout', '$http', 'constants', '$cacheFactory', dataService]);

}());