(function() {
    'use strict';

    function ProfileController($log, userDataService, authentication, badgeService) {
        var vm = this;
        vm.message;
        vm.getBadge = badgeService.retrieveBadge;

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
            vm.message = "You successfully updated your profile!";
        }

        function updateUserError(errorMessage) {
            $log.log(errorMessage);
            vm.message = "Something went wrong! Your profile was not updated!";
        }

        vm.updateUser = function() {
            userDataService.updateUser(vm.currentUser)
                .then(updateUserSuccess)
                .catch(updateUserError);
        };
    }

    angular.module('app')
        .controller('ProfileController', ['$log', 'userDataService', 'authentication', 'badgeService', ProfileController]);

}());