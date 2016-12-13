(function () {
    'use strict';

    angular
        .module('waitrApp')
        .config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', configure]);

    function configure($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');

        $urlRouterProvider.otherwise('/login');

        $stateProvider
        // LOGIN - REGISTER ROUTES
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'logCtrl'
            })
            .state('customer-sign-up', {
                url: '/customer-registration',
                templateUrl: 'app/registration/customer-registration.html',
                controller: 'RegistrationController',
                controllerAs: 'regCtrl'
            })
            .state('restaurant-sign-up', {
                url: '/restaurant-registration',
                templateUrl: 'app/registration/restaurant-registration.html',
                controller: 'RegistrationController',
                controllerAs: 'regCtrl'
            })

            // CUSTOMER ROUTES
            .state('customer', {  //parent, sidenav
                url: '/customer',
                abstract: true,
                templateUrl: './app/customer/customer.html',
                controller: 'CustomerController',
                controllerAs: 'ccc',
                resolve: {
                    currentUser: function (authService, $state) {
                        var user = authService.getUser();
                        if (!user) {
                            return $state.go('login');
                        }
                        return user;
                    }
                }
            })
            .state('customer.home', {
                url: '/home',
                templateUrl: './app/customer/home/customer-home.html',
                controller: 'CustomerHomeController',
                controllerAs: 'chc'
            })

            //restaurant called at home, but not home child
            .state('customer.restaurant', {
                url: '/home/restaurant/:restaurantId',
                templateUrl: './app/customer/restaurant/customer-restaurant.html',
                controller: 'CustomerRestaurantController',
                controllerAs: 'crc'
            })
            .state('customer.waitlistconfirm', {
                url: '/home/restaurant/:restaurantId/waitlist-confirm',
                templateUrl: './app/customer/restaurant/customer-waitlist-confirm.html',
                controller: 'CustomerWaitlistConfirmController',
                controllerAs: 'cwlc'
            })
            .state('customer.settings', {
                url: '/settings',
                templateUrl: './app/customer/settings/customer-settings.html',
                controller: 'CustomerSettingsController',
                controllerAs: 'csc'
            })
            .state('customer.menu', {
                url: '/home/restaurant/:restaurantId/menu',
                templateUrl: './app/customer/menu/customer-menu.html',
                controller: 'CustomerMenuController',
                controllerAs: 'cmc',
            })
            //called in settings, but still customer child
            .state('customer.editContactInfo', {
                url: '/settings/edit-contact-info',
                templateUrl: './app/customer/settings/customer-edit-contact.html',
                controller: 'CustomerSettingsController',
                controllerAs: 'csc'
            })
            .state('customer.waitlist', {
                url: '/waitlist',
                templateUrl: './app/customer/waitlist/customer-waitlist.html',
                controller: 'CustomerWaitlistController',
                controllerAs: 'cwc'
            })

            // RESTAURANT ROUTES
            .state('restaurant', {
                url: '/restaurant',
                abstract: true,
                templateUrl: './app/restaurant/restaurant.html',
                controller: 'RestaurantController',
                controllerAs: 'rrc',
                resolve: {
                    restaurantInfo(authService, restaurantService, $state) {
                        const user = authService.getUser();
                        if (!user) {
                            return $state.go('login');
                        }
                        if (!user.restaurant_id) {
                            return $state.go('login');
                        }
                        return restaurantService.getCurrentRestaurant(user.restaurant_id)
                            .then(function (restaurant) {
                                console.log('user', user);
                                console.log('restaurant', restaurant);
                                return {
                                    currentUser: user,
                                    restaurant: restaurant
                                }
                            })
                    }
                }
            })
            .state('restaurant.home', {
                url: '/home',
                templateUrl: './app/restaurant/home/restaurant-home.html',
                controller: 'RestaurantHomeController',
                controllerAs: 'rhc'
            })


            //called in restaHome, but still restaurant child
            .state('restaurant.addPerson', {
                url: '/home/add-person',
                templateUrl: './app/restaurant/home/restaurant-add-person.html',
                controller: 'RestaurantHomeController',
                controllerAs: 'rhc'
            })
            .state('restaurant.editPerson', {
                url: '/home/edit-person/:waitlist/:person',
                templateUrl: './app/restaurant/home/restaurant-edit-person.html',
                controller: 'RestaurantEditController',
                controllerAs: 'rec'
            })

            .state('restaurant.profile', {
                url: '/profile',
                templateUrl: './app/restaurant/profile/restaurant-profile.html',
                controller: 'RestaurantProfileController',
                controllerAs: 'rpc'
            })
            .state('restaurant.menu', {
                url: '/profile/menu',
                templateUrl: './app/restaurant/menu/restaurant-menu.html'
            })
            .state('restaurant.settings', {
                url: '/settings',
                templateUrl: './app/restaurant/settings/restaurant-settings.html',
                controller: 'RestaurantSettingsController',
                controllerAs: 'rsc'
            })
            //called in restaSettings, but still restaurant child
            .state('restaurant.editInfo', {
                url: '/settings/edit-Info',
                templateUrl: './app/restaurant/settings/restaurant-edit-info.html',
                controller: 'RestaurantSettingsController',
                controllerAs: 'rsc'
            })
            .state('restaurant.editContact', {
                url: '/settings/edit-contact',
                templateUrl: './app/restaurant/settings/restaurant-edit-contact.html',
                controller: 'RestaurantSettingsController',
                controllerAs: 'rsc'
            })
            .state('restaurant.editMenuHome', {
                url: '/settings/menu',
                templateUrl: './app/restaurant/settings/menu/restaurant-menu.html',
                controller: 'RestaurantSettingMenuController',
                controllerAs: 'rsmc'
            })
            .state('restaurant.editMenu', {
                url: '/settings/edit-menu/:id',
                templateUrl: './app/restaurant/settings/menu/restaurant-edit-menu.html',
                controller: 'RestaurantEditMenuController',
                controllerAs: 'remc'
            })
            .state('restaurant.addMenu', {
                url: '/settings/add-menu',
                templateUrl: './app/restaurant/settings/menu/restaurant-add-menu.html',
                controller: 'RestaurantSettingMenuController',
                controllerAs: 'rscmc'
            })
            .state('restaurant.editHours', {
                url: '/settings/edit-hours',
                templateUrl: './app/restaurant/settings/restaurant-edit-hours.html',
                controller: 'RestaurantSettingsController',
                controllerAs: 'rsc'
            });
    }
})();
