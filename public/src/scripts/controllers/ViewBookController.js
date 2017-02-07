(function() {
    'use strict';

    function ViewBookController($stateParams, userDataService, bookDataService, $log, authentication, $state) {
        var vm = this;

        vm.isAuthenticated = authentication.isAuthenticated();
        vm.message;
        vm.thumbnail = "https://images-na.ssl-images-amazon.com/images/I/414JxjdtBHL._SY344_BO1,204,203,200_.jpg";

        function getBookSuccess(book) {
            vm.currentBook = book;
        }

        function getBookError(reason) {
            $log.error(reason);
        }

        bookDataService.getBookByID($stateParams.bookID)
            .then(getBookSuccess)
            .catch(getBookError);

        function addBookSuccess(message) {
            $log.log(message);
            vm.message = "Book with title '" + vm.currentBook.title + "' was added to Favorites.";
        }

        function errorCallback(errorMsg) {
            $log.error('Error Message: ' + errorMsg);
            vm.message = "Something went wrong! Book with title '" + vm.currentBook.title + "' was not added to Favorites.";
        }

        vm.setAsFavorite = function() {
            userDataService.addFavoriteBook(authentication.getCurrentUser().id, { bookID: vm.currentBook._id })
                .then(addBookSuccess)
                .catch(errorCallback);
        };

        vm.goToFavorites = function() {
            $state.transitionTo('app.favoriteBooks');
        };
    }

    angular.module('app')
        .controller('ViewBookController', ['$stateParams', 'userDataService', 'bookDataService', '$log', 'authentication', '$state', ViewBookController]);

}());