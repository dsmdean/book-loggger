(function() {
    'use strict';

    function RegisterController($log, authentication, $location) {

        var vm = this;

        vm.registerData = {};
        vm.message;

        function registerSuccess(message) {
            $log.log(message);
            vm.message = "You are successfully registered. Want to login?";
        }

        function registerError(errorMessage) {
            $log.log(errorMessage);
            vm.message = "Something went wrong! We could not register you.";
        }

        vm.register = function() {
            authentication.register(vm.registerData)
                .then(registerSuccess)
                .catch(registerError);
        };

        vm.goToPage = function(page) {
            $location.path(page);
        };
    }

    angular.module('app')
        .controller('RegisterController', ['$log', 'authentication', '$location', RegisterController]);

}());