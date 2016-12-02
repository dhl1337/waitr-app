(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('RestaurantHomeController', ['waitlistService', '$state', "$ionicHistory", '$scope', '$ionicPopup', RestaurantHomeController]);

    function RestaurantHomeController(waitlistService, $state, $ionicHistory, $scope, $ionicPopup) {
        const vm = this;

        vm.newPerson = {};

        const socket = io.connect('http://localhost:3000');

        socket.on('newPersonAdded', (data) => {
            vm.customerEntries.list.push(data);
            $scope.$apply();
        });

        socket.on('deletedPerson', (data) => {
            vm.customerEntries.list.splice(data.pos, 1);
            $scope.$apply();
        });

        moment.locale('en', {
            relativeTime: {
                future: "in %s",
                past: "%s",
                s: "%ds",
                m: "1m",
                mm: "%dm",
                h: "1h",
                hh: "%dh",
                d: "1d",
                dd: "%dd",
                M: "1mon",
                y: "1y",
                yy: "%dy"
            }
        });

        vm.currentUser = $scope.rrc.currentUser;

        waitlistService.getWaitlist(vm.currentUser.restaurant_id).then(res => vm.customerEntries = res[0]);

        vm.addPersonToQ = (newQPerson) => {
            if (newQPerson.firstName && newQPerson.lastName && newQPerson.phone && newQPerson.partySize) {
                if (waitlistService.isValidPhone(newQPerson.phone) && newQPerson.partySize < waitlistService.maxPartySize) {
                    waitlistService.addAnonToWaitlist(newQPerson, vm.customerEntries._id, vm.customerEntries.quotedTime).then((res) => {
                        socket.emit('newPerson', res);

                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });

                        $state.go("restaurant.home");
                    });
                } else {
                    $ionicPopup.show({
                        title: "Invalid Data",
                        template: "Phone number must be 10 digits and party size cannot exceed 100<br/>Ex. 1234567890",
                        buttons: [
                            {text: "OK"}
                        ]
                    })
                }
            } else {
                $ionicPopup.show({
                    title: "Invalid Data",
                    template: "Fill out all fields before pressing 'Submit'",
                    buttons: [
                        {text: "OK"}
                    ]
                })
            }

        };


        vm.showWaitTimeModal = (time) => {
            vm.time = time;
            var myPopup = $ionicPopup.confirm({
                template: '<label class="item item-input"><input type="tel" ng-model="vm.time" min="0"></label>',
                title: "Enter Wait Time",
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                },
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            vm.time = parseInt(vm.time);
                            if (vm.time < 0 || isNaN(vm.time)) {
                                e.preventDefault();
                            } else {
                                return vm.time;
                            }
                        }
                    }]
            })
                .then(res => {
                    if (res >= 0) {
                        waitlistService.updateWaitTime(vm.customerEntries._id, res).then(function (res) {
                            vm.customerEntries.quotedTime = res;
                        })
                    }
                })
        };

    }

})();

