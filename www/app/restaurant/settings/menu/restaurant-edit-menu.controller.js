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
            vm.editMenu = menu[0];
        });

        vm.updateMenu = () => {
            var updateMenu = {
                menuId: vm.editMenu._id,
                menuTitle: vm.editMenu.title,
                menuDescription: vm.editMenu.description,
                menuPrice: vm.editMenu.price
            };
            restaurantService.updateRestaurantMenu(vm.restaurant._id, updateMenu).then((menu) => {
                $state.go('restaurant.editMenuHome');

            })
        };

    }

})();
