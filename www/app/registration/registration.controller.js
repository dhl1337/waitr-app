(function () {
    'use strict';

    angular
        .module('waitrApp')
        .controller('RegistrationController', ['authService', '$state', RegistrationController]);

    function RegistrationController(authService, $state) {
        var vm = this;

        vm.cust = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: ''
        };
        vm.rest = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            restaurantName: ''
        };

        vm.register = (data) => {

            authService.register(data).then(res => {
                vm.cust.firstName = '';
                vm.cust.lastName = '';
                vm.cust.email = '';
                vm.cust.password = '';
                vm.cust.phone = '';

                vm.rest.firstName = '';
                vm.rest.lastname = '';
                vm.rest.email = '';
                vm.rest.password = '';
                vm.rest.phone = '';
                vm.rest.restaurantName = '';

                if (res.role === 'user') {
                    $state.go('customer.home');
                }

                if (res.role === 'restaurant') {
                    $state.go('restaurant.home');
                }

            });
        }

    }
})();
