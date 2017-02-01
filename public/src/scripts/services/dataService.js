(function() {
    'use strict';

    function dataService($q, $cacheFactory, bookDataService, userDataService) {

        function getUserSummary() {
            var deferred = $q.defer();

            var dataCache = $cacheFactory.get('bookLoggerCache');

            if (!dataCache) {
                dataCache = $cacheFactory('bookLoggerCache');
            }

            var summaryFromCache = dataCache.get('summary');

            if (summaryFromCache) {
                // console.log('returning summary from cache');
                deferred.resolve(summaryFromCache);
            } else {
                // console.log('gathering new summary data');

                var booksPromise = bookDataService.getAllBooks();
                var readersPromise = userDataService.getAllUsers();

                $q.all([booksPromise, readersPromise])
                    .then(function(bookLoggerData) {

                        var allBooks = bookLoggerData[0];
                        var allReaders = bookLoggerData[1];

                        var grandTotalMinutes = 0;

                        allReaders.forEach(function(currentReader, index, array) {
                            grandTotalMinutes += currentReader.total_minutes_read;
                        });

                        var summaryData = {
                            bookCount: allBooks.length,
                            readerCount: allReaders.length,
                            grandTotalMinutes: grandTotalMinutes
                        };

                        dataCache.put('summary', summaryData);

                        deferred.resolve(summaryData);
                    });
            }

            return deferred.promise;
        }

        return {
            getUserSummary: getUserSummary
        };
    }

    angular.module('app')
        .factory('dataService', ['$q', '$cacheFactory', 'bookDataService', 'userDataService', dataService]);

}());