(function() {

    var app = angular.module('app', ['ngRoute', 'ngCookies', 'ngResource', 'ui.router']);

    app.provider('books', ['constants', function(constants) {

        var includeVersionInTitle = false;
        this.setIncludeVersionInTitle = function(value) {
            includeVersionInTitle = value;
        };

        this.$get = function() {
            var appName = constants.APP_TITLE;
            var appDesc = constants.APP_DESCRIPTION;

            var version = constants.APP_VERSION;

            if (includeVersionInTitle) {
                appName += ' ' + version;
            }

            return {
                appName: appName,
                appDesc: appDesc
            };
        };
    }]);

    app.config(['booksProvider', '$routeProvider', '$stateProvider', '$urlRouterProvider', '$logProvider', '$httpProvider', '$provide', function(booksProvider, $routeProvider, $stateProvider, $urlRouterProvider, $logProvider, $httpProvider, $provide) {

        $provide.decorator('$log', ['$delegate', 'books', logDecorator]);

        booksProvider.setIncludeVersionInTitle(true);
        $logProvider.debugEnabled(true);

        $httpProvider.interceptors.push('bookLoggerInterceptor');

        $stateProvider
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'app/templates/header.html'
                    },
                    'content': {
                        templateUrl: 'app/templates/books.html',
                        controller: 'BooksController',
                        controllerAs: 'books'
                    },
                    'footer': {
                        templateUrl: 'app/templates/footer.html'
                    }
                }
            })
            .state('app.addBook', {
                url: 'AddBook',
                views: {
                    'content@': {
                        templateUrl: 'app/templates/addBook.html',
                        controller: 'AddBookController',
                        controllerAs: 'bookAdder'
                    }
                }
            })
            .state('app.editBook', {
                url: 'EditBook/:bookID',
                views: {
                    'content@': {
                        templateUrl: 'app/templates/editBook.html',
                        controller: 'EditBookController',
                        controllerAs: 'bookEditor'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

        // $routeProvider
        //     .when('/', {
        //         templateUrl: 'app/templates/books.html',
        //         controller: 'BooksController',
        //         controllerAs: 'books'
        //     })
        //     .when('/AddBook', {
        //         templateUrl: 'app/templates/addBook.html',
        //         controller: 'AddBookController',
        //         controllerAs: 'bookAdder'
        //     })
        //     .when('/EditBook/:bookID', {
        //         templateUrl: 'app/templates/editBook.html',
        //         controller: 'EditBookController',
        //         controllerAs: 'bookEditor'
        //     })
        //     .otherwise('/');
    }]);

    function logDecorator($delegate, books) {

        function log(message) {
            message += ' - ' + new Date() + ' (' + books.appName + ')';
            $delegate.log(message);
        }

        function info(message) {
            $delegate.info(message);
        }

        function warn(message) {
            $delegate.warn(message);
        }

        function error(message) {
            $delegate.error(message);
        }

        function debug(message) {
            $delegate.debug(message);
        }

        function awesome(message) {
            message = 'Awesome!!! - ' + message;
            $delegate.debug(message);
        }

        return {
            log: log,
            info: info,
            warn: warn,
            error: error,
            debug: debug,
            awesome: awesome
        };

    }

    app.run(['$rootScope', function($rootScope) {

        $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
            // console.log('successfully changed routes');
        });

        $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
            console.log('error changing routes');

            console.log(event);
            console.log(current);
            console.log(previous);
            console.log(rejection);
        });
    }]);

}());