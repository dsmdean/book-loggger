(function() {
    'use strict';

    function AddBookController($log, $location, bookDataService, $state) {
        var vm = this;

        vm.newBook = {};

        function addBookSuccess(message) {
            $log.info(message);
        }

        function addBookError(errorMessage) {
            $log.error(errorMessage);
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
        .controller('AddBookController', ['$log', '$location', 'bookDataService', '$state', '$stateParams', AddBookController]);

}());