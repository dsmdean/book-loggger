(function() {

    function LoginController($log, authentication) {

        var vm = this;

        vm.loginData = {};

        function doLoginSuccess(response) {
            $log.log('Login succesfull');
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
        .controller('LoginController', ['$log', 'authentication', LoginController]);

}());