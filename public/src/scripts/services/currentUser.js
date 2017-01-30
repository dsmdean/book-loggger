(function() {
    'use strict';

    function currentUser() {

        var lastBookEdited = {};

        return {
            lastBookEdited: lastBookEdited
        };
    }

    angular.module('app')
        .factory('currentUser', currentUser);

}());