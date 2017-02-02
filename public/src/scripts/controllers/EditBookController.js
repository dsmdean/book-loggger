(function() {
    'use strict';

    function EditBookController($stateParams, $cookies, $log, $location, currentUser, bookDataService, userDataService, authentication) {
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

        function updateBookSuccess(message) {
            $log.info(message);
            $location.path('/');
        }

        function updateBookError(errorMessage) {
            $log.error(errorMessage);
        }

        vm.saveBook = function() {
            bookDataService.updateBook(vm.currentBook)
                .then(updateBookSuccess)
                .catch(updateBookError);

            // vm.currentBook.$update();
            // $location.path('/');
        };

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
        .controller('EditBookController', ['$stateParams', '$cookies', '$log', '$location', 'currentUser', 'bookDataService', 'userDataService', 'authentication', EditBookController]);

}());