(function() {
    'use strict';

    function UsersController($window, $log, $timeout, authentication, userDataService, badgeService) {

        var vm = this;

        vm.isAuthenticated = authentication.isAuthenticated();
        vm.isAdmin = authentication.isAdmin();
        vm.thumbnail = "http://images.iimg.in/c/569f4771c45d324bda8b4660-4-501-0-1453279096/google/user-icon-png-pnglogocom.img?crop=1";
        vm.search = "";
        vm.getBadge = badgeService.retrieveBadge;
        vm.loading = {
            busy: false,
            cycle: 1,
            complete: false
        };

        vm.loadMoreData = function() {
            if (vm.loading.cycle * 6 > vm.allUsers.length) {
                vm.loading.complete = true;
            }
            vm.loading.busy = true;

            $timeout(function() {
                vm.loading.cycle++;
                vm.loadedUsers = vm.allUsers.slice(0, vm.loading.cycle * 6);
                vm.loading.busy = false;
            }, 500);
        };

        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                vm.loadMoreData();
            }
        });

        function getUsersSuccess(users) {
            vm.allUsers = users;
            vm.loadedUsers = vm.allUsers.slice(0, vm.loading.cycle * 6);
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        userDataService.getAllUsers()
            .then(getUsersSuccess)
            .catch(errorCallback);
    }

    angular.module('app')
        .controller('UsersController', ['$window', '$log', '$timeout', 'authentication', 'userDataService', 'badgeService', UsersController]);

}());