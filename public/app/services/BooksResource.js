(function() {
    angular.module('app')
        .factory('BooksResource', ['$resource', BooksResource]);

    function BooksResource($resource) {
        return $resource('/api/books/:bookID', { bookID: '@_id' }, {
            update: { method: 'PUT' }
        });
    }
}());