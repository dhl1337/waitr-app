(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('RestaurantController', ['restaurantInfo', RestaurantController]);

    function RestaurantController(restaurantInfo) {

        const vm = this;

        vm.currentUser = restaurantInfo.currentUser;
        vm.restaurant = restaurantInfo.restaurant[0];

    }

})();
