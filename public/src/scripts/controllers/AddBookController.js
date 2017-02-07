(function() {
    'use strict';

    function AddBookController($log, bookDataService, $state) {
        var vm = this;

        vm.newBook = {};
        vm.message;

        function addBookSuccess(message) {
            $log.info(message);
            vm.message = "Book with title '" + vm.newBook.title + "' was added.";
        }

        function addBookError(errorMessage) {
            $log.error(errorMessage);
            vm.message = "Something went wrong! Book with title '" + vm.newBook.title + "' was not added.";
        }

        vm.addBook = function() {
            bookDataService.addBook(vm.newBook)
                .then(addBookSuccess)
                .catch(addBookError);
        };

        vm.goToBooks = function() {
            $state.transitionTo('app');
        }
    }

    angular.module('app')
        .controller('AddBookController', ['$log', 'bookDataService', '$state', '$stateParams', AddBookController]);

}());