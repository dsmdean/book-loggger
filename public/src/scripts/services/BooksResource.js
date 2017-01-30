(function() {
    'use strict';

    function BooksResource($resource, constants) {
        return $resource(constants.APP_SERVER + '/api/books/:bookID', { bookID: '@_id' }, {
            update: { method: 'PUT' }
        });
    }

    angular.module('app')
        .factory('BooksResource', ['$resource', 'constants', BooksResource]);

}());