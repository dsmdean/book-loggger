(function() {

    function RegisterController($log, authentication) {

        var vm = this;

        vm.registerData = {};

        function registerSuccess(response) {
            $log.log('Registration succesfull');
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
        .controller('RegisterController', ['$log', 'authentication', RegisterController]);

}());