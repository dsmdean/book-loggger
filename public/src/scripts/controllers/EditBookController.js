(function() {
    'use strict';

    function EditBookController($state, $stateParams, $log, bookDataService, userDataService, authentication) {
        var vm = this;
        vm.message;

        function getBookSuccess(book) {
            vm.currentBook = book;
        }

        function getBookError(reason) {
            $log.error(reason);
        }

        bookDataService.getBookByID($stateParams.bookID)
            .then(getBookSuccess)
            .catch(getBookError);

        function updateBookSuccess(message) {
            $log.info(message);
            vm.message = "Book with title '" + vm.currentBook.title + "' was edited.";
        }

        function updateBookError(errorMessage) {
            $log.error(errorMessage);
            vm.message = "Something went wrong! Book with title '" + vm.currentBook.title + "' was not edited.";
        }

        vm.saveBook = function() {
            bookDataService.updateBook(vm.currentBook)
                .then(updateBookSuccess)
                .catch(updateBookError);
        };

        function addBookSuccess(message) {
            $log.log(message);
            vm.message = "Book with title '" + vm.currentBook.title + "' was added to favorites.";
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
            vm.message = "Something went wrong! Book with title '" + vm.currentBook.title + "' was not added to favorites.";
        }

        vm.setAsFavorite = function() {
            userDataService.addFavoriteBook(authentication.getCurrentUser().id, { bookID: vm.currentBook._id })
                .then(addBookSuccess)
                .catch(errorCallback);
        };

        vm.loadState = function(state) {
            $state.transitionTo(state);
        };
    }

    angular.module('app')
        .controller('EditBookController', ['$state', '$stateParams', '$log', 'bookDataService', 'userDataService', 'authentication', EditBookController]);

}());