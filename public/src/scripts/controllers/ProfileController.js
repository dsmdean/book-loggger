(function() {
    'use strict';

    function ProfileController($log, $location, dataService, authentication) {
        var vm = this;

        function getUserSuccess(user) {
            vm.currentUser = user;
        }

        function getUserError(reason) {
            $log.error(reason);
        }

        dataService.getUserByID(authentication.getCurrentUser().id)
            .then(getUserSuccess)
            .catch(getUserError);

        function updateUserSuccess(message) {
            $log.log(message);
        }

        function updateUserError(errorMessage) {
            $log.log(errorMessage);
        }

        vm.updateUser = function() {
            dataService.updateUser(vm.currentUser)
                .then(updateUserSuccess)
                .catch(updateUserError);
        };
    }

    angular.module('app')
        .controller('ProfileController', ['$log', '$location', 'dataService', 'authentication', ProfileController]);

}());