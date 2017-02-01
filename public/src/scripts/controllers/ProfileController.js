(function() {
    'use strict';

    function ProfileController($log, userDataService, authentication) {
        var vm = this;

        function getUserSuccess(user) {
            vm.currentUser = user;
        }

        function getUserError(reason) {
            $log.error(reason);
        }

        userDataService.getUserByID(authentication.getCurrentUser().id)
            .then(getUserSuccess)
            .catch(getUserError);

        function updateUserSuccess(message) {
            $log.log(message);
        }

        function updateUserError(errorMessage) {
            $log.log(errorMessage);
        }

        vm.updateUser = function() {
            userDataService.updateUser(vm.currentUser)
                .then(updateUserSuccess)
                .catch(updateUserError);
        };
    }

    angular.module('app')
        .controller('ProfileController', ['$log', 'userDataService', 'authentication', ProfileController]);

}());