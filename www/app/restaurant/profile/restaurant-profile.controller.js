(function () {
    angular
        .module('waitrApp')
        .controller('RestaurantProfileController', ['waitlistService', '$scope', RestaurantProfileController]);

    function RestaurantProfileController(waitlistService, $scope) {

        var vm = this;

        vm.infoHoursToggle = true;
        vm.currentUser = $scope.rrc.currentUser;
        vm.restaurant = $scope.rrc.restaurant;

        waitlistService.getWaitlist(vm.currentUser.restaurant_id).then(res => vm.customerEntries = res[0]);

        vm.callTel = () => window.location.href = 'tel:' + vm.restaurant.restaurantPhone;

        vm.getWebsite = () => {
            window.open(vm.restaurant.restaurantWebsite, '_system', 'location=yes');
            return false;
        };

        vm.infoHoursToggle = true;

        vm.showOnClick = (value) => vm.infoHoursToggle = value;
    }

})();
