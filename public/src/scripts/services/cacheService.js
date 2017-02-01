(function() {
    'use strict';

    function cacheService(constants, $cacheFactory, authentication) {

        // cache functions & summary functions 

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

        function deleteReadBooksResponseFromCache() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(constants.APP_SERVER + '/api/users/' + authentication.getCurrentUser().id + '/booksRead');
        }

        function deleteFavoriteBooksResponseFromCache() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(constants.APP_SERVER + '/api/users/' + authentication.getCurrentUser().id + '/favoriteBooks');
        }

        function deleteCurrentUserResponseFromCache() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(constants.APP_SERVER + '/api/users/' + authentication.getCurrentUser().id);
        }

        return {
            deleteSummaryFromCache: deleteSummaryFromCache,
            deleteAllUsersResponseFromCache: deleteAllUsersResponseFromCache,
            deleteAllBooksResponseFromCache: deleteAllBooksResponseFromCache,
            deleteFavoriteBooksResponseFromCache: deleteFavoriteBooksResponseFromCache,
            deleteCurrentUserResponseFromCache: deleteCurrentUserResponseFromCache,
            deleteReadBooksResponseFromCache: deleteReadBooksResponseFromCache
        };
    }

    angular.module('app')
        .factory('cacheService', ['constants', '$cacheFactory', 'authentication', cacheService]);

}());