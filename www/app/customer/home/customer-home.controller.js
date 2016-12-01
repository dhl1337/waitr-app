(function () {
    angular
        .module('waitrApp')
        .controller('CustomerHomeController', ['restaurantService', CustomerHomeController]);

    function CustomerHomeController(restaurantService) {
        var vm = this;

        vm.reverse = false;

        restaurantService.getRestaurants().then(restaurant => vm.restaurantList = restaurant);
    }

})();
