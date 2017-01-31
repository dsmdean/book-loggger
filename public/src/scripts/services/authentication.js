(function() {

    function authentication($log, constants, dataService, $q, $http, $localStorage, $rootScope) {

        var TOKEN_KEY = 'Token';
        var loggedIn = false;
        var currentUser = {};
        var admin = false;
        var authToken = undefined;

        function loadUserCredentials() {
            var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username != undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            $localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function useCredentials(credentials) {
            loggedIn = true;
            currentUser = credentials;
            authToken = credentials.token;

            if (credentials.admin) {
                isAdmin = true;
            }

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
        }

        function destroyUserCredentials() {
            authToken = undefined;
            currentUser = {};
            loggedIn = false;
            admin = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            $localStorage.remove(TOKEN_KEY);
        }

        function loginSuccess(response) {
            loggedIn = true;

            if (response.data.user.admin) {
                storeUserCredentials({ id: response.data.user._id, firstname: response.data.user.firstname, lastname: response.data.user.lastname, username: response.data.user.username, token: response.data.token, admin: response.data.user.admin });
                admin = true;
            } else {
                storeUserCredentials({ id: response.data.user._id, firstname: response.data.user.firstname, lastname: response.data.user.lastname, username: response.data.user.username, token: response.data.token });
            }

            $rootScope.$broadcast('login:Successful');

            return 'User logged in: ' + response.data.user.username;
        }

        function loginError(response) {
            return $q.reject('Error logging in. (HTTP status: ' + response.status + ').');
        }

        function doLogin(loginData) {
            return $http.post(constants.APP_SERVER + '/api/users/login', loginData)
                .then(loginSuccess)
                .catch(loginError);
        }

        function registerSuccess(response) {
            // dologin({ username: response.config.data.username, password: response.config.data.password });

            return 'User added: ' + response.config.data.username;
        }

        function registerError(response) {
            return $q.reject('Error registering user. (HTTP status: ' + response.status + ')');
        }

        function register(newUser) {

            dataService.deleteAllUsersResponseFromCache();
            dataService.deleteSummaryFromCache();

            return $http.post(constants.APP_SERVER + '/api/users/register', newUser)
                .then(registerSuccess)
                .catch(registerError);
        }

        function logoutSuccess(response) {
            destroyUserCredentials();

            return 'Logged out - ' + response.staus;
        }

        function logoutError() {
            return $q.reject('Error logging out. (HTTP status: ' + response.status + ')');
        }

        function logout() {
            return $http.get(constants.APP_SERVER + '/api/users/logout')
                .then(logoutSuccess)
                .catch(logoutError);

            destroyUserCredentials();
        }

        function isAuthenticated() {
            return loggedIn;
        }

        function getCurrentUser() {
            return currentUser;
        }

        function isAdmin() {
            return admin;
        }

        loadUserCredentials();

        return {
            doLogin: doLogin,
            register: register,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getCurrentUser: getCurrentUser,
            isAdmin: isAdmin
        };
    }

    angular.module('app')
        .factory('authentication', ['$log', 'constants', 'dataService', '$q', '$http', '$localStorage', '$rootScope', authentication]);

}());