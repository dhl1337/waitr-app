(function () {
    'use strict';
    angular
        .module('waitrApp')
        .service('authService', ['$http', 'SERVER_URL', 'authTokenService', '$rootScope', authService]);

    function authService($http, SERVER_URL, authTokenService, $rootScope) {
        this.register = (data) => {
            $http.post(`${SERVER_URL}/register`, data).then(response => {
                authTokenService.setToken(response.data.token);
                const currentUser = parseToken(response.data.token);
                $rootScope.$broadcast('currentUser', currentUser);
            })
        };

        this.login = (credentials) => {
            $http.post(`${SERVER_URL}/login`, credentials).then(response => {
                authTokenService.setToken(response.data.token);
                const currentUser = parseToken(response.data.token);
                $rootScope.$broadcast('currentUser', currentUser);
            })
        };

        this.logout = () => authTokenService.setToken();

        this.isAuthenticated = () => !!this.getUser();

        this.isAuthorized = (authorizedRoles) => {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }

            return (isAuthenticated() && authorizedRoles.indexOf(getUser().role) !== -1);
        };

        const parseToken = (token) => {
            if (token) {
                return JSON.parse(atob(token.split('.')[1]));
            } else {
                return null;
            }
        };

        this.getUser = () => {
            const currentUser = authTokenService.getToken();
            if (currentUser) {
                return JSON.parse(atob(currentUser.split('.')[1]));
            } else {
                return null;
            }
        }

    }
})();
