(function () {
    'use strict';

    angular
        .module('waitrApp')
        .service('authInterceptorService', ['$rootScope', 'AUTH_EVENTS', 'authTokenService', authInterceptorService]);

    function authInterceptorService($rootScope, AUTH_EVENTS, authTokenService) {

        this.addAuthToken = (config) => {
            var token = authTokenService.getToken();
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        };

        this.responseError = (response) => {
            $rootScope.$broadcast({
                401: AUTH_EVENTS.notAuthenticated, // Failed attempt OR User not found
                403: AUTH_EVENTS.notAuthorized // Not Authorized to access resource
            }[response.status], response);
            return response;
        }

    }
})();
