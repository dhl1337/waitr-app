(function () {
    'use strict';
    angular
        .module('waitrApp')
        .service('authTokenService', ['$window', authTokenService]);

    function authTokenService($window) {

        this.setToken = (token) => {
            if (token) {
                $window.localStorage.setItem('token', token);
                return token;
            } else {
                $window.localStorage.removeItem('token');
            }
        };

        this.getToken = () => $window.localStorage.getItem('token');

    }
})();
