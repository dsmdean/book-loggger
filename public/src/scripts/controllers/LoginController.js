(function() {
    'use strict';

    function LoginController($log, authentication, $location) {

        var vm = this;

        vm.loginData = {};

        function doLoginSuccess(message) {
            $log.log(message);
            $location.path('/profile');
        }

        function doLoginError(errorMessage) {
            $log.log(errorMessage);
        }

        vm.doLogin = function() {
            authentication.doLogin(vm.loginData)
                .then(doLoginSuccess)
                .catch(doLoginError);
        };
    }

    angular.module('app')
        .controller('LoginController', ['$log', 'authentication', '$location', LoginController]);

}());