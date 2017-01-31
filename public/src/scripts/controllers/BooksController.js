(function() {
    'use strict';

    function BooksController(books, $window, dataService, logger, badgeService, $q, $cookies, $cookieStore, $log, $route, $state, $stateParams, BooksResource, currentUser, $timeout, authentication) {

        var vm = this;

        vm.appName = books.appName;
        vm.thumbnail = "https://images-na.ssl-images-amazon.com/images/I/414JxjdtBHL._SY344_BO1,204,203,200_.jpg";
        vm.search = "";
        vm.loading = {
            busy: false,
            cycle: 1,
            complete: false
        };

        vm.loadMoreData = function() {
            if (vm.loading.cycle * 6 > vm.allBooks.length) {
                vm.loading.complete = true;
            }
            vm.loading.busy = true;

            $timeout(function() {
                vm.loading.cycle++;
                vm.loadedBooks = vm.allBooks.slice(0, vm.loading.cycle * 6);
                vm.loading.busy = false;
            }, 2000);
        };

        angular.element($window).bind("scroll", function() {
            if (this.pageYOffset >= 100) {
                vm.loadMoreData();
            }
        });

        function getUserSummarySuccess(summaryData) {
            // $log.log(summaryData);
            vm.summaryData = summaryData;
        }

        dataService.getUserSummary()
            .then(getUserSummarySuccess);

        // vm.allBooks = BooksResource.query();

        function getBooksSuccess(books) {
            vm.allBooks = books;
            vm.loadedBooks = vm.allBooks.slice(0, vm.loading.cycle * 6);
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        dataService.getAllBooks()
            .then(getBooksSuccess)
            .catch(errorCallback);

        function deleteBookSuccess(message) {
            $log.info(message);
            // $route.reload();

            $state.transitionTo($state.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        }

        function deleteBookError(errorMessage) {
            $log.error(errorMessage);
        }

        vm.deleteBook = function(bookID) {
            dataService.deleteBook(bookID)
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        };

        vm.getBadge = badgeService.retrieveBadge;

        vm.favoriteBook = $cookies.favoriteBook;

        // vm.lastEdited = $cookieStore.get('lastEdited');
        vm.currentUser = currentUser;

        vm.isAuthenticated = authentication.isAuthenticated();
    }

    angular.module('app')
        .controller('BooksController', ['books', '$window', 'dataService', 'logger', 'badgeService', '$q', '$cookies', '$cookieStore', '$log', '$route', '$state', '$stateParams', 'BooksResource', 'currentUser', '$timeout', 'authentication', BooksController]);

}());