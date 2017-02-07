(function() {
    'use strict';

    function BooksController($window, dataService, $log, $state, $stateParams, $timeout, authentication, bookDataService, userDataService) {

        var vm = this;

        vm.isAuthenticated = authentication.isAuthenticated();
        vm.isAdmin = authentication.isAdmin();
        vm.thumbnail = "https://images-na.ssl-images-amazon.com/images/I/414JxjdtBHL._SY344_BO1,204,203,200_.jpg";
        vm.search = "";
        vm.bookRead = {
            id: 0,
            timeRead: 0,
            title: '',
            message: undefined
        };
        vm.bookDelete = {
            id: 0,
            title: '',
            message: undefined
        };
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
            }, 500);
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
            vm.bookRead.message = "Something went wrong! The book was not added to Read Books.";
        }

        function getBooks() {
            bookDataService.getAllBooks()
                .then(getBooksSuccess)
                .catch(errorCallback);
        }

        function deleteBookSuccess(message) {
            $log.info(message);
            // $route.reload();
            vm.bookDelete.message = "Book with title '" + vm.bookDelete.title + "' was deleted.";
            getBooks();
        }

        function deleteBookError(errorMessage) {
            $log.error(errorMessage);
            vm.bookDelete.message = "Something went wrong! The book was not deleted.";
        }

        vm.deleteBook = function(bookID) {
            bookDataService.deleteBook(bookID)
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        };

        function updateMinutesSuccess(message) {
            $log.log(message);

            vm.summaryData.grandTotalMinutes += vm.bookRead.timeRead;
            vm.bookRead.message = "Book with title '" + vm.bookRead.title + "' was added to Read Books.";
        }

        function addBookSuccess(message) {
            $log.log(message);

            userDataService.updateTotalMinutesUser({ id: authentication.getCurrentUser().id, minutes_read: vm.bookRead.timeRead })
                .then(updateMinutesSuccess)
                .catch(errorCallback);
        }

        vm.setAsRead = function(bookID) {
            userDataService.addReadBook(authentication.getCurrentUser().id, { bookID: bookID })
                .then(addBookSuccess)
                .catch(errorCallback);
        };

        vm.setBookRead = function(bookID, title) {
            vm.bookRead.id = bookID;
            vm.bookRead.title = title;
        }

        vm.setBookDelete = function(bookID, title) {
            vm.bookDelete.id = bookID;
            vm.bookDelete.title = title;
        }

        vm.reloadState = function(state) {
            $state.transitionTo(state, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };

        getBooks();
    }

    angular.module('app')
        .controller('BooksController', ['$window', 'dataService', '$log', '$state', '$stateParams', '$timeout', 'authentication', 'bookDataService', 'userDataService', BooksController]);

}());