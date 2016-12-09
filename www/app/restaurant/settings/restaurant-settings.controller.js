(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('RestaurantSettingsController', ['restaurantService', 'restaurantInfo', '$state', RestaurantSettingsController])
        .directive('formattedTime', function () {

            return {
                require: '?ngModel',
                link: function (scope, elem, attr, ngModel) {
                    if (!ngModel)
                        return;
                    if (attr.type !== 'time')
                        return;

                    ngModel.$formatters.unshift((value) => value.replace(/:[0-9]+.[0-9]+$/, ''));
                }

            };

        });

    function RestaurantSettingsController(restaurantService, restaurantInfo, $state) {

        const vm = this;

        vm.currentUserID = restaurantInfo.currentUser.id;
        vm.restaurant = restaurantInfo.restaurant[0];

        vm.restaurant.hours.monday.openTime = new Date(vm.restaurant.hours.monday.openTime);
        vm.restaurant.hours.monday.closeTime = new Date(vm.restaurant.hours.monday.closeTime);
        vm.restaurant.hours.tuesday.openTime = new Date(vm.restaurant.hours.tuesday.openTime);
        vm.restaurant.hours.tuesday.closeTime = new Date(vm.restaurant.hours.tuesday.closeTime);
        vm.restaurant.hours.wednesday.openTime = new Date(vm.restaurant.hours.wednesday.openTime);
        vm.restaurant.hours.wednesday.closeTime = new Date(vm.restaurant.hours.wednesday.closeTime);
        vm.restaurant.hours.thursday.openTime = new Date(vm.restaurant.hours.thursday.openTime);
        vm.restaurant.hours.thursday.closeTime = new Date(vm.restaurant.hours.thursday.closeTime);
        vm.restaurant.hours.friday.openTime = new Date(vm.restaurant.hours.friday.openTime);
        vm.restaurant.hours.friday.closeTime = new Date(vm.restaurant.hours.friday.closeTime);
        vm.restaurant.hours.saturday.openTime = new Date(vm.restaurant.hours.saturday.openTime);
        vm.restaurant.hours.saturday.closeTime = new Date(vm.restaurant.hours.saturday.closeTime);
        vm.restaurant.hours.sunday.openTime = new Date(vm.restaurant.hours.sunday.openTime);
        vm.restaurant.hours.sunday.closeTime = new Date(vm.restaurant.hours.sunday.closeTime);

        vm.updateRestaurant = restaurant => restaurantService.updateRestaurant(vm.restaurant._id, restaurant);

        var getRestaurant = function () {
            restaurantService.getCurrentRestaurant(vm.restaurant._id).then(function (restaurant) {
                console.log('restaurant', restaurant);
                vm.currentRestaurant = restaurant[0];
            })
        };

        getRestaurant();

        vm.deleteMenuItem = (item) => {
            restaurantService.deleteRestaurantMenuItem(vm.restaurant._id, {_id: item._id}).then(function (restaurant) {
                console.log('restaurant', restaurant);
                getRestaurant();
            })
        };

        vm.showWaitTimeModal = (time) => {
            vm.time = time;
            var myPopup = $ionicPopup.confirm({
                template: '<label class="item item-input"><input type="tel" ng-model="vm.time" min="0"></label>',
                title: "Enter Wait Time",
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            vm.time = parseInt(vm.time);
                            if (vm.time < 0 || isNaN(vm.time)) {
                                e.preventDefault();
                            } else {
                                return vm.time;
                            }
                        }
                    }]
            })
                .then(res => {
                    if (res >= 0) {
                        waitlistService.updateWaitTime(vm.customerEntries._id, res).then(function (res) {
                            vm.customerEntries.quotedTime = res;
                        })
                    }
                })
        };

    }
})();
