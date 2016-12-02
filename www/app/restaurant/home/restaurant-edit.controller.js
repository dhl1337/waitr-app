(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('RestaurantEditController', ['waitlistService', '$state', "$ionicHistory", "$stateParams", "$ionicPopup", 'restaurantService', '$scope', RestaurantEditController]);

    function RestaurantEditController(waitlistService, $state, $ionicHistory, $stateParams, $ionicPopup, restaurantService, $scope) {
        
        const socket = io.connect('http://localhost:3000');
        const vm = this;

        vm.currentRestaurant = $scope.rrc.restaurant;

        waitlistService.getOneFromWaitlist($stateParams.person, $stateParams.waitlist).then(function (res) {
            vm.person = res
        });

        vm.notification = function () {
            var obj = {
                phone: '+1' + vm.person.phone,
                firstName: vm.person.firstName,
                restaurant: vm.currentRestaurant.restaurantName
                //message: vm.message
            };
            console.log('this is the phone number', obj.phone);
            restaurantService.notification(obj);
        };

        vm.submitEditedEntry = function (person) {
            console.log("vm.person is: ", person);
            waitlistService.updateWaitlistEntry($stateParams.person, $stateParams.waitlist, person).then(function (res) {
                console.log("successfully updated entry!");

                $state.go("restaurant.home");
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            })
        };

        var removeFromWaitlist = function () {
            waitlistService.removeFromWaitlist($stateParams.person, $stateParams.waitlist).then(function (res) {
                socket.emit('deletePerson', res);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("restaurant.home");
            })
        };

        vm.showCheckInPopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Check in user",
                template: "Are you sure you want to check in this user?"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to check person in");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to check person in");
                }
            });
            $state.go("restaurant.home");
        };

        vm.showCheckInPopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Check in user",
                template: "Are you sure you want to check in this user?"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to check person in");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to check person in");
                }
            });
        };

        vm.showRemovePopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Remove from waitlist",
                template: "WARNING: this will remove the user from the waitlist entirely"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to remove person from list");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to remove person from list");
                }
            })
        }

    }
})();
