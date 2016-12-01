(function () {
    'use strict';

    angular
        .module('waitrApp')
        .controller('LoginController', ['authService', '$state', LoginController]);


    function LoginController(authService, $state) {
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
