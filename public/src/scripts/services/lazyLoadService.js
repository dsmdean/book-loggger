(function() {
    'use strict';

    function lazyLoad($timeout) {

        var loading = {
            busy: false,
            cycle: 1,
            complete: false
        };

        function getLoading() {
            return loading;
        }

        function loadMoreData(allData) {
            if (loading.cycle * 6 > allData.length) {
                loading.complete = true;
            }
            loading.busy = true;

            $timeout(function() {
                loading.cycle++;
                var loadedData = allData.slice(0, loading.cycle * 6);
                loading.busy = false;

                return loadedData;
            }, 500);
        };

        return {
            getLoading: getLoading,
            loadMoreData: loadMoreData
        };
    }

    angular.module('app')
        .factory('lazyLoad', ['$timeout', lazyLoad]);

}());