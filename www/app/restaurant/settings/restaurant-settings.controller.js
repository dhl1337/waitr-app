(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('RestaurantSettingsController', ['restaurantService', '$scope', '$filter', RestaurantSettingsController])
        .directive('formattedTime', function ($filter) {

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

    function RestaurantSettingsController(restaurantService, $scope, $filter) {

        const vm = this;

        vm.currentUserID = $scope.rrc.currentUser.restaurant_id;
        vm.restaurant = $scope.rrc.restaurant;

        console.log('restaurant', vm.restaurant);

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

    }
})();
