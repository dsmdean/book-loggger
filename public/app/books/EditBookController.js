(function() {
    angular.module('app')
        .controller('EditBookController', ['$routeParams', '$stateParams', 'books', '$cookies', '$cookieStore', 'dataService', '$log', '$location', 'BooksResource', 'currentUser', EditBookController]);

    function EditBookController($routeParams, $stateParams, books, $cookies, $cookieStore, dataService, $log, $location, BooksResource, currentUser) {
        var vm = this;

        dataService.getBookByID($stateParams.bookID)
            .then(getBookSuccess)
            .catch(getBookError);

        // vm.currentBook = BooksResource.get({ bookID: $routeParams.bookID });
        // $log.log(vm.currentBook);

        function getBookSuccess(book) {
            vm.currentBook = book;
            // $cookieStore.put('lastEdited', vm.currentBook);
            currentUser.lastBookEdited = vm.currentBook;
        }

        function getBookError(reason) {
            $log.error(reason);
        }

        vm.saveBook = function() {
            dataService.updateBook(vm.currentBook)
                .then(updateBookSuccess)
                .catch(updateBookError);

            // vm.currentBook.$update();
            // $location.path('/');
        };

        function updateBookSuccess(message) {
            $log.info(message);
            $location.path('/');
        }

        function updateBookError(errorMessage) {
            $log.error(errorMessage);
        }

        vm.setAsFavorite = function() {
            $cookies.favoriteBook = vm.currentBook.title;
        }
    }

}());