(function() {

    function authentication($log, constants, dataService, $q, $http) {

        function doLogin(loginData) {
            $log.info('Do login with: ' + loginData);
        }

        function registerSucces(response) {
            return 'User added: ' + response.config.data.username;
        }

        function registerError(response) {
            return $q.reject('Error registering user. (HTTP status: ' + response.status + ')');
        }

        function register(newUser) {

            dataService.deleteAllUsersResponseFromCache();
            dataService.deleteSummaryFromCache();

            return $http.post(constants.APP_SERVER + '/api/users/register', newUser)
                .then(registerSucces)
                .catch(registerError);
        }

        return {
            doLogin: doLogin,
            register: register
        };
    }

    angular.module('app')
        .factory('authentication', ['$log', 'constants', 'dataService', '$q', '$http', authentication]);

}());