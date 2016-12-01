(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('CustomerSettingsController', ['userService', '$state', '$scope', CustomerSettingsController]);

    function CustomerSettingsController(userService, $state, $scope) {

        let vm = this;

        vm.currentUser = $scope.ccc.currentUser;
        vm.firstName = vm.currentUser.firstName;
        vm.lastName = vm.currentUser.lastName;
        vm.phone = vm.currentUser.phone;
        vm.email = vm.currentUser.email;

        vm.updateUser = (firstName, lastName, phone, email) => {

            const user = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email
            };

            userService.updateUser(vm.currentUser._id, user).then(updateUser => {
                $scope.ccc.currentUser = updateUser;
                $state.go('customer.settings');
            });

        };
    }

})();
