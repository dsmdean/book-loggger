(function() {
    'use strict';

    function HeaderController($log, authentication, $location, $rootScope, $state, $stateParams, $interval, $localStorage, $window) {

        var vm = this;

        vm.loggedIn = false;
        vm.isAdmin = false;
        vm.currentUser = {};
        var tokenExpiration;
        var interval;

        function stopInterval() {
            $interval.cancel(interval);
        }

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

            tokenExpiration = $localStorage.getObject('tokenExpiration', '{}');
            if (tokenExpiration.date === undefined) {
                tokenExpiration = { date: new Date().addHours(23.75) };
                $localStorage.storeObject('tokenExpiration', tokenExpiration);
            }

            $log.debug('Token expiration: ' + Date.parse(tokenExpiration.date));

            interval = $interval(function() {
                if (new Date() >= Date.parse(tokenExpiration.date)) {
                    $log.debug('Time is up!');
                    vm.logOut();

                    $window.alert("Your token has ended. You have been logged out!");
                } else {
                    $log.debug('Still some time left');
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
            stopInterval();
            $localStorage.remove('tokenExpiration');

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
        .controller('HeaderController', ['$log', 'authentication', '$location', '$rootScope', '$state', '$stateParams', '$interval', '$localStorage', '$window', HeaderController]);

}());