(function() {

    function HeaderController($log, authentication, $location, $rootScope, $state, $stateParams) {

        var vm = this;

        vm.loggedIn = false;
        vm.isAdmin = false;
        vm.currentUser = {};

        if (authentication.isAuthenticated()) {
            vm.loggedIn = true;
            vm.currentUser = authentication.getCurrentUser();

            if (authentication.isAdmin()) {
                vm.isAdmin = true;
            }

            $location.path("/");

        }

        $rootScope.$on('login:Successful', function() {
            vm.loggedIn = true;
            vm.currentUser = authentication.getCurrentUser();

            if (authentication.isAdmin()) {
                vm.isAdmin = true;
            }

            $location.path("/");

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
        .controller('HeaderController', ['$log', 'authentication', '$location', '$rootScope', '$state', HeaderController]);

}());