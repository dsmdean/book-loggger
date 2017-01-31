(function() {

    function LoginController($log, authentication, $location) {

        var vm = this;

        vm.loginData = {};

        function doLoginSuccess(message) {
            $log.log(message);
            $location.path('/');
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