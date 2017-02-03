(function() {
    'use strict';

    function HeaderController($log, authentication, $location, $rootScope, $state, $stateParams, $interval) {

        var vm = this;

        vm.loggedIn = false;
        vm.isAdmin = false;
        vm.currentUser = {};

        function loginSuccess() {
            vm.loggedIn = true;
            vm.currentUser = authentication.getCurrentUser();

            if (authentication.isAdmin()) {
                vm.isAdmin = true;
            }

            Date.prototype.addHours = function(h) {
                this.setTime(this.getTime() + (h * 60 * 60 * 1000));
                return this;
            };

            var tokenExpiration = new Date().addHours(0.05);

            $log.debug('Token expiration: ' + tokenExpiration);

            function stopInterval() {
                $interval.cancel(interval);
            }

            var interval = $interval(function() {
                if (new Date() >= tokenExpiration) {
                    // $log.debug('Time is up!');

                    // TODO: open alert so user knows they're being logged out
                    vm.logOut();
                    stopInterval();
                } else {
                    // $log.debug('Still some time left');
                }
            }, 60000);

            $location.path("/");

        }

        if (authentication.isAuthenticated()) {
            loginSuccess();
        }

        $rootScope.$on('login:Successful', function() {
            loginSuccess();
        });

        function doLogoutSuccess(message) {
            $log.log(message);

            $state.transitionTo('app', $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        }

        function doLogoutError(errorMessage) {
            $log.log(errorMessage);
        }

        vm.logOut = function() {
            authentication.logout()
                .then(doLogoutSuccess)
                .catch(doLogoutError);
        };
    }

    angular.module('app')
        .controller('HeaderController', ['$log', 'authentication', '$location', '$rootScope', '$state', '$stateParams', '$interval', HeaderController]);

}());