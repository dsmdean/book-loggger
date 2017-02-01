(function() {
    'use strict';

    function AddBookController($log, $location, bookDataService) {
        var vm = this;

        vm.newBook = {};

        function addBookSuccess(message) {
            $log.info(message);
            $location.path('/');
        }

        function addBookError(errorMessage) {
            $log.error(errorMessage);
        }

        vm.addBook = function() {
            bookDataService.addBook(vm.newBook)
                .then(addBookSuccess)
                .catch(addBookError);
        };
    }

    angular.module('app')
        .controller('AddBookController', ['$log', '$location', 'bookDataService', AddBookController]);

}());