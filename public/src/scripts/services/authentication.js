(function() {

    function authentication($log) {

        function doLogin(loginData) {
            $log.info('Do login with: ' + loginData);
        }

        function register(registerData) {
            $log.info('Do registration with: ' + registerData);
        }

        return {
            doLogin: doLogin,
            register: register
        };
    }

    angular.module('app')
        .factory('authentication', ['$log', authentication]);

}());