(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('CustomerWaitlistConfirmController', ['$stateParams', '$scope', 'waitlistService', 'restaurantService', '$state', 'userService', '$ionicHistory', CustomerWaitlistConfirmController]);

    function CustomerWaitlistConfirmController($stateParams, $scope, waitlistService, restaurantService, $state, userService, $ionicHistory) {

        var vm = this,
            currRest = $stateParams.restaurantId,
            socket = io.connect('http://localhost:3000');

        vm.currentUser = $scope.ccc.currentUser;

        restaurantService.getCurrentRestaurant(currRest).then(data => vm.currRestObj = data);

        vm.userAddingToQ = (firstname, lastname, partysize, phone, notes) => {
            const person = {
                user_id: vm.currentUser._id,
                firstName: firstname,
                lastName: lastname,
                partySize: partysize,
                phone: phone,
                notes: notes
            };

            waitlistService.addAnonToWaitlist(person, vm.currRestObj[0].waitlist_id)
                .then(newPerson => {

                    socket.emit('newPerson', newPerson);

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    });

                    let waitlistId = {
                        inWaitList: vm.currRestObj[0].waitlist_id
                    };

                    userService.updateUser(vm.currentUser._id, waitlistId).then(() => {
                        $scope.ccc.currentUser.inWaitList = waitlistId.inWaitList;
                        $state.go("customer.waitlist");
                    });
                });
        }

    }

})();
