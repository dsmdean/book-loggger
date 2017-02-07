(function() {
    'use strict';

    function BooksReadController($window, $log, $timeout, authentication, userDataService) {

        var vm = this;

        vm.isAuthenticated = authentication.isAuthenticated();
        vm.thumbnail = "https://images-na.ssl-images-amazon.com/images/I/414JxjdtBHL._SY344_BO1,204,203,200_.jpg";
        vm.search = "";
        vm.message;
        vm.book;
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

        function getBooksSuccess(books) {
            vm.allBooks = books;
            vm.loadedBooks = vm.allBooks.slice(0, vm.loading.cycle * 6);
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        function getReadBooks() {
            userDataService.getReadBooks(authentication.getCurrentUser().id)
                .then(getBooksSuccess)
                .catch(errorCallback)
        };

        vm.deleteFromList = function(bookID, title) {
            vm.book = { id: bookID, title: title };
            $log.log(vm.book.title);
        }

        function deleteBookSuccess(message) {
            $log.info(message);

            vm.message = "Book with title '" + vm.book.title + "' was deleted from list.";
            getReadBooks();
        }

        function deleteBookError(errorMessage) {
            $log.error(errorMessage);
            vm.message = "Something went wrong! The book was not deleted from list.";
        }

        vm.deleteBook = function() {
            userDataService.deleteReadBooks(authentication.getCurrentUser().id, vm.book.id)
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        };

        getReadBooks();
    }

    angular.module('app')
        .controller('BooksReadController', ['$window', '$log', '$timeout', 'authentication', 'userDataService', BooksReadController]);

}());