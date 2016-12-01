(function () {
    angular
        .module('waitrApp')
        .controller('CustomerRestaurantController', ['restaurantService', 'userService', 'waitlistService', '$stateParams', '$ionicHistory', '$state', '$scope', CustomerRestaurantController]);

    function CustomerRestaurantController(restaurantService, userService, waitlistService, $stateParams, $ionicHistory, $state, $scope) {

        var vm = this;

        vm.infoHoursToggle = true;
        vm.restaurantId = $stateParams.restaurantId;
        vm.currentUser = $scope.ccc.currentUser;
        //console.log(vm.currentUser);

        //we need to get the user again just in case they get added to a list
        /*userService.currentUser(vm.currentUser._id).then(function(res) {
         vm.currentUser = res[0];
         //console.log(vm.currentUser);
         })*/

        restaurantService.getCurrentRestaurant(vm.restaurantId).then((restaurant) => vm.restaurant = restaurant[0]);

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

        vm.getWebsite = () => {
            window.open(vm.restaurant.restaurantWebsite, '_system', 'location=yes');
            return false;
        };

        vm.goBack = () => $ionicHistory.goBack();

        vm.infoHoursToggle = true;
        vm.showOnClick = value => vm.infoHoursToggle = value;
    }

})();
