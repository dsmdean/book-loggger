(function() {
    'use strict';

    function RegisterController($log, authentication, $location) {

        var vm = this;

        vm.registerData = {};

        function registerSuccess(message) {
            $log.log(message);
            $location.path('/');
        }

        function registerError(errorMessage) {
            $log.log(errorMessage);
        }

        vm.register = function() {
            authentication.register(vm.registerData)
                .then(registerSuccess)
                .catch(registerError);
        };
    }

    angular.module('app')
        .controller('RegisterController', ['$log', 'authentication', '$location', RegisterController]);

}());