(function () {
    "use strict";
    angular
        .module('waitrApp')
        .controller('RestaurantSettingMenuController', ['restaurantInfo', 'restaurantService', '$state', '$scope', RestaurantSettingMenuController]);

    function RestaurantSettingMenuController (restaurantInfo, restaurantService, $state, $scope) {

        const vm = this;

        var currentRestaurant = restaurantInfo.restaurant[0];

        $scope.$on("$ionicView.beforeEnter", function(event, data){
            restaurantService.getCurrentRestaurant(currentRestaurant._id).then((restaurant) => {
                vm.restaurant = restaurant[0];
            });
        });

        vm.addMenu = () => {
            const menu = {
                title: vm.menuTitle,
                description: vm.menuDescription,
                price: vm.menuPrice
            };
            restaurantService.addRestaurantMenu(vm.restaurant._id, menu).then(function (updateMenu) {
                vm.menuTite = '';
                vm.menuDescription = '';
                vm.menuPrice = '';
                $state.go('restaurant.editMenuHome');
            })
        };

    }

})();
