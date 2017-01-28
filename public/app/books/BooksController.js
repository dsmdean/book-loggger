(function() {

    angular.module('app')
        .controller('BooksController', ['books', 'dataService', 'logger', 'badgeService', '$q', '$cookies', '$cookieStore', '$log', '$route', 'BooksResource', BooksController]);

    function BooksController(books, dataService, logger, badgeService, $q, $cookies, $cookieStore, $log, $route, BooksResource) {

        var vm = this;

        vm.appName = books.appName;

        /**
        var booksPromise = dataService.getAllBooks();
        var readersPromise = dataService.getAllReaders();

        $q.all([booksPromise, readersPromise])
            .then(getAllDataSuccess)
            .catch(getAllDataError);

        function getAllDataSuccess(dataArray) {
            vm.allBooks = dataArray[0];
            vm.allReaders = dataArray[1];
        }

        function getAllDataError(reason) {
            console.log(reason);
        }
        **/

        // dataService.getAllBooks()
        //     .then(getBooksSuccess)
        //     .catch(errorCallback)
        //     .finally(getAllBooksComplete);

        vm.allBooks = BooksResource.query();

        function getBooksSuccess(books) {
            vm.allBooks = books;
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
        }

        function getAllBooksComplete() {
            $log.info('getAllBooks has completed.');
        }

        dataService.getAllReaders()
            .then(getReadersSuccess)
            .catch(errorCallback)
            .finally(getAllReadersComplete);

        function getReadersSuccess(readers) {
            vm.allReaders = readers;
        }

        function getAllReadersComplete() {
            $log.info('getAllReaders has completed.');
        }

        vm.deleteBook = function(bookID) {
            dataService.deleteBook(bookID)
                .then(deleteBookSuccess)
                .catch(deleteBookError);
        };

        function deleteBookSuccess(message) {
            $log.info(message);
            $route.reload();
        }

        function deleteBookError(errorMessage) {
            $log.error(errorMessage);
        }

        vm.getBadge = badgeService.retrieveBadge;

        vm.favoriteBook = $cookies.favoriteBook;

        vm.lastEdited = $cookieStore.get('lastEdited');

    }
}());