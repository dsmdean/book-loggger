(function() {
    'use strict';

    function AddBookController($log, $location, bookDataService, $state, $stateParams) {
        var vm = this;

        vm.newBook = {};

        function addBookSuccess(message) {
            $log.info(message);
            // $location.path('/');

            $state.transitionTo('app', $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
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
        .controller('AddBookController', ['$log', '$location', 'bookDataService', '$state', '$stateParams', AddBookController]);

}());