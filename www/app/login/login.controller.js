(function () {
    'use strict';

    angular
        .module('waitrApp')
        .controller('LoginController', ['authService', '$state', '$ionicPopup', LoginController]);


    function LoginController(authService, $state, $ionicPopup) {
        var vm = this;

        vm.credentials = {
            email: '',
            password: ''
        };

        vm.login = credentials => {
            authService.login(credentials).then((user) => {
                vm.credentials.email = '';
                vm.credentials.password = '';
                if (user.role === 'user') {
                    $state.go('customer.home');
                }
                if (user.role === 'restaurant') {
                    $state.go('restaurant.home');
                }
            });
        }


    }
})();
