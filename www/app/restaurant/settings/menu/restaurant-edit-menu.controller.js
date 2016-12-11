(function () {
    "use strict";
    angular
        .module('waitrApp')
        .controller('RestaurantEditMenuController', ['restaurantInfo', 'restaurantService', '$stateParams', '$state', RestaurantEditMenuController]);

    function RestaurantEditMenuController (restaurantInfo, restaurantService, $stateParams, $state) {
        const menuId = $stateParams.id;
        const vm = this;

        vm.restaurant = restaurantInfo.restaurant[0];

        restaurantService.getMenuItem(vm.restaurant._id, menuId).then((menu) => {
            console.log(menu);
        })

    }

})();
