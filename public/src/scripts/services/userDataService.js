(function() {
    'use strict';

    function userDataService($q, $timeout, $http, constants, $cacheFactory, cacheService, authentication) {

        function sendResponseData(response) {
            return response.data;
        }

        function sendGetBooksError(response) {
            return $q.reject('Error retrieving book(s). (HTTP status: ' + response.status + ')');
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
            cacheService.deleteReadBooksResponseFromCache();

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

            cacheService.deleteFavoriteBooksResponseFromCache();

            return $http.post(constants.APP_SERVER + '/api/users/' + userID + '/favoriteBooks', book)
                .then(addFavoriteBookSucces)
                .catch(addFavoriteBookError);
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
            return $http({
                    method: 'GET',
                    url: constants.APP_SERVER + '/api/users/' + userID,
                    cache: true
                })
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

            cacheService.deleteCurrentUserResponseFromCache();
            authentication.updateCurrentUser(user);

            return $http({
                    method: 'PUT',
                    url: constants.APP_SERVER + '/api/users/' + user._id,
                    data: user
                })
                .then(updateUserSuccess)
                .catch(updateUserError);
        }

        function updateTotalMinutesUser(user) {

            cacheService.deleteCurrentUserResponseFromCache();
            cacheService.deleteSummaryFromCache();

            // var dataCache = $cacheFactory.get('bookLoggerCache');
            // dataCache.remove('summary');

            return $http({
                    method: 'PUT',
                    url: constants.APP_SERVER + '/api/users/' + user.id + '/totalMinutesRead',
                    data: user
                })
                .then(updateUserSuccess)
                .catch(updateUserError);
        }

        function deleteFavoriteSuccess(response) {
            return 'Favorite book deleted';
        }

        function deleteFavoriteError(response) {
            return $q.reject('Error deleting favorite book. (HTTP status: ' + response.status + ')');
        }

        function deleteBookFromFavorites(userID, bookID) {

            cacheService.deleteFavoriteBooksResponseFromCache();

            return $http({
                    method: 'DELETE',
                    url: constants.APP_SERVER + '/api/users/' + userID + '/favoriteBooks/' + bookID
                })
                .then(deleteFavoriteSuccess)
                .catch(deleteFavoriteError);
        }

        function deleteReadBooksSuccess(response) {
            return 'Read book deleted';
        }

        function deleteReadBooksError(response) {
            return $q.reject('Error deleting read book. (HTTP status: ' + response.status + ')');
        }

        function deleteReadBooks(userID, bookID) {

            cacheService.deleteReadBooksResponseFromCache();

            return $http({
                    method: 'DELETE',
                    url: constants.APP_SERVER + '/api/users/' + userID + '/booksRead/' + bookID
                })
                .then(deleteReadBooksSuccess)
                .catch(deleteReadBooksError);
        }

        return {
            getAllUsers: getAllReaders,
            getUserByID: getUserByID,
            updateUser: updateUser,
            getReadBooks: getReadBooks,
            addReadBook: addReadBook,
            getFavoriteBooks: getFavoriteBooks,
            addFavoriteBook: addFavoriteBook,
            updateTotalMinutesUser: updateTotalMinutesUser,
            deleteBookFromFavorites: deleteBookFromFavorites,
            deleteReadBooks: deleteReadBooks
        };
    }

    angular.module('app')
        .factory('userDataService', ['$q', '$timeout', '$http', 'constants', '$cacheFactory', 'cacheService', 'authentication', userDataService]);

}());