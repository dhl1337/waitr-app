(function () {
    'use strict';
    angular
        .module('waitrApp')
        .service('userService', ['$http', 'SERVER_URL', userService]);

    function userService($http, SERVER_URL) {

        this.currentUser = (id) => $http.get(`${SERVER_URL}/api/user/${id}`).then(response => response.data);

        this.updateUser = (id, obj) => $http.put(`${SERVER_URL}/api/user/${id}`, obj).then(response => response.data);

    }

})();
