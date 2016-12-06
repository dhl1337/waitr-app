(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('CustomerWaitlistController', ['userService', 'restaurantService', '$scope', 'waitlistService', '$ionicPopup', '$state', '$ionicHistory', CustomerWaitlistController]);

    function CustomerWaitlistController(userService, restaurantService, $scope, waitlistService, $ionicPopup, $state, $ionicHistory) {

        const vm = this;
        const socket = io.connect('http://localhost:3000');

        vm.currentUser = $scope.ccc.currentUser;

        socket.on('newPersonAdded', (data) => {
            console.log('new person added', data);
            vm.currentUser.inWaitList.list.push(data);
            $scope.$apply();
        });

        socket.on('deletedPerson', (data) => {
            if (vm.currentUser.inWaitList) {
                vm.currentUser.inWaitList.list.splice(data.pos, 1);
                $scope.$apply();
            }
        });

        userService.currentUser(vm.currentUser._id).then((user) => {
            vm.currentUser = user[0];

            restaurantService.getCurrentRestaurant(vm.currentUser.inWaitList.restaurant_id).then((data) => vm.restaurant = data[0]);
        });

        vm.removeFromWaitlist = () => {
            let list = vm.currentUser.inWaitList.list;
            for (let i = 0; i < list.length; i++) {
                if (list[i].user_id == vm.currentUser._id) {
                    waitlistService.removeFromWaitlist(list[i]._id, vm.currentUser.inWaitList._id).then((res) => {
                        $scope.ccc.currentUser.inWaitList = undefined;
                        socket.emit('deletePerson', res);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go("customer.home");
                    });
                }
            }
        };

        vm.showRemovePopup = function () {
            let confirmPopup = $ionicPopup.confirm({
                title: "Remove from waitlist",
                template: "WARNING: this will remove you from the list"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    vm.removeFromWaitlist();
                }
            })
        }
    }

})();
