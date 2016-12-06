(function () {
    'use strict';
    angular.module('waitrApp', ['ionic', 'ngCordova', 'angularMoment'])

        .run($ionicPlatform => {
            $ionicPlatform.ready(() => {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                    // Don't remove this line unless you know what you are doing. It stops the viewport
                    // from snapping when text inputs are focused. Ionic handles this internally for
                    // a much nicer keyboard experience.
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .constant('AUTH_EVENTS', {
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        })


        .constant('USER_ROLES', {
            user: 'user',
            restaurant: 'restaurant'
        })

        //.constant('SERVER_URL', 'http://104.131.135.179')
        .constant('SERVER_URL', 'http://localhost:3000')


        .run(function ($rootScope, AUTH_EVENTS, authService, $timeout, $state) {

            var user = authService.getUser();
            if (user) {
                $timeout(function () {
                    $rootScope.$broadcast('currentUser', user);
                });
            }

            $rootScope.$on('$stateChangeStart', function (event, next) {
                if (next.data) {
                    var authorizedRoles = next.data.authorizedRoles;
                    if (!authService.isAuthorized(authorizedRoles)) {
                        event.preventDefault();
                        if (authService.isAuthenticated()) {
                            // user is not allowed
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                            $state.go($state.$current, {}, {reload: true});
                        } else {
                            // user is not logged in
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                            $state.go('login');
                        }
                    }
                }
            });

        })

        .config($httpProvider => $httpProvider.interceptors.push('authInterceptorService'))

        .controller('AppCtrl', ['AUTH_EVENTS', 'authService', '$scope', '$state', '$ionicPopup', AppCtrl]);

    function AppCtrl(AUTH_EVENTS, authService, $scope, $state, $ionicPopup) {
        var vm = this;

        $scope.$on('currentUser', (event, user) => setCurrentUser(user));

        $scope.$on(AUTH_EVENTS.notAuthorized, (event) => {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'Invalid access.',
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-energized'
                }]
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, (event, response) => {
            authService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthenticated!',
                template: response.data,
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-energized'
                }]
            });
        });

        vm.currentUser = null;

        vm.logout = () => {
            vm.currentUser = null;
            authService.logout();
            $state.go('login');
        };

        let setCurrentUser = (user) => vm.currentUser = user;

    }

})();
