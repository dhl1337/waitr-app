(function () {
    "use strict";
    angular
        .module('waitrApp')
        .controller('RestaurantSettingMenuController', ['restaurantInfo', 'restaurantService', '$stateParams', '$state', RestaurantSettingMenuController]);

    function RestaurantSettingMenuController (restaurantInfo, restaurantService, $stateParams, $state) {
        const menuId = $stateParams.id;
        const vm = this;

        console.log('menu id', menuId);

        vm.restaurant = restaurantInfo.restaurant[0];

        vm.addMenu = () => {
            const menu = {
                title: vm.menuTitle,
                description: vm.menuDescription,
                price: vm.menuPrice
            };
            console.log('menu', menu);
            restaurantService.updateRestaurantMenu(vm.restaurant._id, menu).then(function (updateMenu) {
                vm.menuTite = '';
                vm.menuDescription = '';
                vm.menuPrice = '';
                $state.go('restaurant.editMenuHome');
            })
        };

    }

})();
