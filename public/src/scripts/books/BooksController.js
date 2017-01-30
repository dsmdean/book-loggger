(function() {
    'use strict';

    function BooksController(books, dataService, logger, badgeService, $q, $cookies, $cookieStore, $log, $route, $state, $stateParams, BooksResource, currentUser) {

        var vm = this;

        vm.appName = books.appName;
        vm.thumbnail = "https://images-na.ssl-images-amazon.com/images/I/414JxjdtBHL._SY344_BO1,204,203,200_.jpg";
        vm.search = "";

        function getUserSummarySuccess(summaryData) {
            // $log.log(summaryData);
            vm.summaryData = summaryData;
        }

        dataService.getUserSummary()
            .then(getUserSummarySuccess);

        // vm.allBooks = BooksResource.query();

        function getBooksSuccess(books) {
            vm.allBooks = books;
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        function getAllBooksComplete() {
            // $log.info('getAllBooks has completed.');
        }

        dataService.getAllBooks()
            .then(getBooksSuccess)
            .catch(errorCallback)
            .finally(getAllBooksComplete);

        function getReadersSuccess(readers) {
            vm.allReaders = readers;
            $log.awesome('All readers retrieved');
        }

        function getAllReadersComplete() {
            // $log.info('getAllReaders has completed.');
        }

        dataService.getAllReaders()
            .then(getReadersSuccess)
            .catch(errorCallback)
            .finally(getAllReadersComplete);

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
    }

    angular.module('app')
        .controller('BooksController', ['books', 'dataService', 'logger', 'badgeService', '$q', '$cookies', '$cookieStore', '$log', '$route', '$state', '$stateParams', 'BooksResource', 'currentUser', BooksController]);

}());