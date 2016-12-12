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
                title: vm.editMenu.title,
                description: vm.editMenu.description,
                price: vm.editMenu.price
            };
            console.log('update menu', updateMenu);
            restaurantService.addRestaurantMenu(vm.restaurant._id, updateMenu).then((menu) => {
                console.log('updated menu', menu);
                $state.go('restaurant.editMenuHome');
            })
        };

    }

})();
