(function() {
    'use strict';

    function ViewBookController($stateParams, $cookieStore, userDataService, bookDataService, $log, currentUser, authentication) {
        var vm = this;

        // vm.currentBook = BooksResource.get({ bookID: $routeParams.bookID });
        // $log.log(vm.currentBook);

        function getBookSuccess(book) {
            vm.currentBook = book;
            // $cookieStore.put('lastEdited', vm.currentBook);
            currentUser.lastBookEdited = vm.currentBook;
        }

        function getBookError(reason) {
            $log.error(reason);
        }

        bookDataService.getBookByID($stateParams.bookID)
            .then(getBookSuccess)
            .catch(getBookError);

        function addBookSuccess(message) {
            $log.log(message);
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        vm.setAsFavorite = function() {
            userDataService.addFavoriteBook(authentication.getCurrentUser().id, { bookID: vm.currentBook._id })
                .then(addBookSuccess)
                .catch(errorCallback);
        };
    }

    angular.module('app')
        .controller('ViewBookController', ['$stateParams', '$cookieStore', 'userDataService', 'bookDataService', '$log', 'currentUser', 'authentication', ViewBookController]);

}());