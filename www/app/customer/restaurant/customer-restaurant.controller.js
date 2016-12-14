(function () {
    angular
        .module('waitrApp')
        .controller('CustomerRestaurantController', ['restaurantService', 'userService', 'waitlistService', '$stateParams', '$ionicHistory', '$state', '$scope', CustomerRestaurantController]);

    function CustomerRestaurantController(restaurantService, userService, waitlistService, $stateParams, $ionicHistory, $state, $scope) {

        var vm = this;

        vm.infoInfoToggle = true;
        vm.restaurantId = $stateParams.restaurantId;
        vm.currentUser = $scope.ccc.currentUser;
        //console.log(vm.currentUser);

        //we need to get the user again just in case they get added to a list
        /*userService.currentUser(vm.currentUser._id).then(function(res) {
         vm.currentUser = res[0];
         //console.log(vm.currentUser);
         })*/

        restaurantService.getCurrentRestaurant(vm.restaurantId).then((restaurant) => vm.restaurant = restaurant[0]);

        vm.showOnClick = (value) => {
            if (value === 'menu') {
                vm.infoMenuToggle = true;
                vm.infoInfoToggle = false;
                vm.infoHoursToggle = false;
            }
            if (value === 'info') {
                vm.infoInfoToggle = true;
                vm.infoMenuToggle = false;
                vm.infoHoursToggle = false;
            }
            if (value === 'hours') {
                vm.infoHoursToggle = true;
                vm.infoInfoToggle = false;
                vm.infoMenuToggle = false;
            }
        };

        waitlistService.getWaitlist(vm.restaurantId).then(res => vm.customerEntries = res[0]);

        vm.userAddingToQ = function () {
            waitlistService.addAnonToWaitlist(vm.currentUser, vm.restaurant.waitlist_id).then(() => {

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go("restaurant.home");
            });
        };

        vm.callTel = () => window.location.href = 'tel:' + vm.restaurant.restaurantPhone;

        vm.getWebsite = () => window.open(vm.restaurant.restaurantWebsite);

        vm.goBack = () => $ionicHistory.goBack();
    }

})();
