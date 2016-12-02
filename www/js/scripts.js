'use strict';

(function () {
    'use strict';

    angular.module('waitrApp');
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp', ['ionic', 'ngCordova', 'angularMoment']).run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }).constant('AUTH_EVENTS', {
        notAuthenticated: 'auth-not-authenticated',
        notAuthorized: 'auth-not-authorized'
    }).constant('USER_ROLES', {
        user: 'user',
        restaurant: 'restaurant'
    })

    //.constant('SERVER_URL', 'http://104.131.135.179')
    .constant('SERVER_URL', 'http://localhost:3000').run(function ($rootScope, AUTH_EVENTS, authService, $timeout, $state) {

        var user = authService.getUser();
        if (user) {
            $timeout(function () {
                $rootScope.$broadcast('currentUser', user);
            });
        }

        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.data) {
                var authorizedRoles = next.data.authorizedRoles;
                if (!authService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (authService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                        $state.go($state.$current, {}, { reload: true });
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        $state.go('login');
                    }
                }
            }
        });
    }).config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    }).controller('AppCtrl', ['$rootScope', 'AUTH_EVENTS', 'authService', '$scope', '$state', '$ionicPopup', AppCtrl]);

    function AppCtrl($rootScope, AUTH_EVENTS, authService, $scope, $state, $ionicPopup) {
        var ac = this;

        $scope.$on('currentUser', function (event, user) {
            setCurrentUser(user);
        });

        $scope.$on(AUTH_EVENTS.notAuthorized, function (event) {
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthorized!',
                template: 'Invalid access.',
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-energized'
                }]
            });
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, response) {
            authService.logout();
            $state.go('login');
            var alertPopup = $ionicPopup.alert({
                title: 'Unauthenticated!',
                template: response.data,
                buttons: [{
                    text: '<b>OK</b>',
                    type: 'button-energized'
                }]
            });
        });

        ac.currentUser = null;
        ac.logout = logout;

        ////////////////

        function logout() {
            ac.currentUser = null;
            authService.logout();
            $state.go('login');
        }

        function setCurrentUser(user) {
            ac.currentUser = user;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'USER_ROLES', configure]);

    function configure($stateProvider, $urlRouterProvider, $ionicConfigProvider, USER_ROLES) {

        $ionicConfigProvider.backButton.text('').icon('ion-ios7-arrow-left');

        $urlRouterProvider.otherwise('/login');

        $stateProvider
        // LOGIN - REGISTER ROUTES
        .state('login', {
            url: '/login',
            templateUrl: 'app/login/login.html',
            controller: 'LoginController',
            controllerAs: 'logCtrl'
        }).state('customer-sign-up', {
            url: '/customer-registration',
            templateUrl: 'app/registration/customer-registration.html',
            controller: 'RegistrationController',
            controllerAs: 'regCtrl'
        }).state('restaurant-sign-up', {
            url: '/restaurant-registration',
            templateUrl: 'app/registration/restaurant-registration.html',
            controller: 'RegistrationController',
            controllerAs: 'regCtrl'
        })

        // CUSTOMER ROUTES
        .state('customer', { //parent, sidenav
            url: '/customer',
            abstract: true,
            templateUrl: './app/customer/customer.html',
            controller: 'CustomerController',
            controllerAs: 'ccc',
            resolve: {
                currentUser: function currentUser(authService, $state) {
                    var user = authService.getUser();
                    if (!user) {
                        return $state.go('login');
                    }
                    return user;
                }
            }
        }).state('customer.home', {
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
        }).state('customer.waitlistconfirm', {
            url: '/home/restaurant/:restaurantId/waitlist-confirm',
            templateUrl: './app/customer/restaurant/customer-waitlist-confirm.html',
            controller: 'CustomerWaitlistConfirmController',
            controllerAs: 'cwlc'
        }).state('customer.settings', {
            url: '/settings',
            templateUrl: './app/customer/settings/customer-settings.html',
            controller: 'CustomerSettingsController',
            controllerAs: 'csc'
        }).state('customer.menu', {
            url: '/home/restaurant/:restaurantId/menu',
            templateUrl: './app/customer/menu/customer-menu.html',
            controller: 'CustomerMenuController',
            controllerAs: 'cmc'
        })
        //called in settings, but still customer child
        .state('customer.editContactInfo', {
            url: '/settings/edit-contact-info',
            templateUrl: './app/customer/settings/customer-edit-contact.html',
            controller: 'CustomerSettingsController',
            controllerAs: 'csc'
        }).state('customer.waitlist', {
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
                restaurantInfo: function restaurantInfo(authService, restaurantService, $state) {
                    var user = authService.getUser();
                    if (!user) {
                        return $state.go('login');
                    }
                    if (!user.restaurant_id) {
                        return $state.go('login');
                    }
                    return restaurantService.getCurrentRestaurant(user.restaurant_id).then(function (restaurant) {
                        return {
                            currentUser: user,
                            restaurant: restaurant
                        };
                    });
                }
            }
        }).state('restaurant.home', {
            url: '/home',
            templateUrl: './app/restaurant/home/home.html',
            controller: 'RestaurantHomeController',
            controllerAs: 'rhc'
        })

        //called in restaHome, but still restaurant child
        .state('restaurant.addPerson', {
            url: '/home/add-person',
            templateUrl: './app/restaurant/home/restaurant-add-person.html',
            controller: 'RestaurantHomeController',
            controllerAs: 'rhc'
        }).state('restaurant.editPerson', {
            url: '/home/edit-person/:waitlist/:person',
            templateUrl: './app/restaurant/home/restaurant-edit-person.html',
            controller: 'RestaurantEditController',
            controllerAs: 'rec'
        }).state('restaurant.profile', {
            url: '/profile',
            templateUrl: './app/restaurant/restaProfile/restaProfile.html',
            controller: 'restaProfileCtrl',
            controllerAs: 'rpc'
        })
        //not child of profile, but called by profile
        .state('restaurant.menu', {
            url: '/profile/menu',
            templateUrl: './app/restaurant/restaMenu/restaMenu.html',
            controller: 'restaMenuCtrl',
            controllerAs: 'rmc'
        }).state('restaurant.settings', {
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
        }).state('restaurant.editContact', {
            url: '/settings/edit-contact',
            templateUrl: './app/restaurant/settings/restaurant-edit-contact.html',
            controller: 'RestaurantSettingsController',
            controllerAs: 'rsc'
        }).state('restaurant.editMenu', {
            url: '/settings/edit-menu',
            templateUrl: './app/restaurant/settings/restaurant-edit-menu.html',
            controller: 'RestaurantEditMenuController',
            controllerAs: 'remc'
        }).state('restaurant.editHours', {
            url: '/settings/edit-hours',
            templateUrl: './app/restaurant/settings/restaurant-edit-hours.html',
            controller: 'RestaurantSettingsController',
            controllerAs: 'rsc'
        });
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('CustomerController', ['currentUser', CustomerController]);

    function CustomerController(currentUser) {

        var vm = this;

        vm.currentUser = currentUser;
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('LoginController', ['authService', '$state', LoginController]);

    function LoginController(authService, $state) {
        var vm = this;

        vm.credentials = {
            email: '',
            password: ''
        };

        vm.login = function (credentials) {
            authService.login(credentials).then(function (user) {
                vm.credentials.email = '';
                vm.credentials.password = '';
                if (user.role === 'user') {
                    $state.go('customer.home');
                }
                if (user.role === 'restaurant') {
                    $state.go('restaurant.home');
                }
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('RegistrationController', ['authService', '$state', RegistrationController]);

    function RegistrationController(authService, $state) {
        var vm = this;

        vm.cust = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: ''
        };
        vm.rest = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phone: '',
            restaurantName: ''
        };

        vm.register = function (data) {

            authService.register(data).then(function (res) {
                vm.cust.firstName = '';
                vm.cust.lastName = '';
                vm.cust.email = '';
                vm.cust.password = '';
                vm.cust.phone = '';

                vm.rest.firstName = '';
                vm.rest.lastname = '';
                vm.rest.email = '';
                vm.rest.password = '';
                vm.rest.phone = '';
                vm.rest.restaurantName = '';

                if (res.role === 'user') {
                    $state.go('customer.home');
                }

                if (res.role === 'restaurant') {
                    $state.go('restaurant.home');
                }
            });
        };
    }
})();
'use strict';

(function () {
  'use strict';

  angular.module('waitrApp').factory('authInterceptorService', authInterceptorService);

  authInterceptorService.$inject = ['$rootScope', '$q', 'AUTH_EVENTS', 'authTokenService'];

  function authInterceptorService($rootScope, $q, AUTH_EVENTS, authTokenService) {
    return {

      request: addAuthToken,
      responseError: responseError

    };

    //////////////////

    function addAuthToken(config) {
      var token = authTokenService.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }

    function responseError(response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated, // Failed attempt OR User not found
        403: AUTH_EVENTS.notAuthorized // Not Authorized to access resource
      }[response.status], response);
      return $q.reject(response);
    }

    // Status 200: OK
    // Status 500: Issue with request
  }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').factory('authService', authService);

    authService.$inject = ['$http', 'SERVER_URL', '$q', 'authTokenService', '$state', '$rootScope'];

    function authService($http, SERVER_URL, $q, authTokenService, $state, $rootScope) {

        return {

            register: register,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAuthorized: isAuthorized,
            getUser: getUser

        };

        //////////////////

        function register(data) {
            var deferred = $q.defer();
            $http.post(SERVER_URL + '/register', data).then(function (res) {
                authTokenService.setToken(res.data.token);
                var currentUser = parseToken(res.data.token);
                $rootScope.$broadcast('currentUser', currentUser);
                return deferred.resolve(currentUser);
            }, function (res) {
                return deferred.reject(res);
            });
            return deferred.promise;
        }

        function login(credentials) {
            var deferred = $q.defer();
            $http.post(SERVER_URL + '/login', credentials).then(function (res) {
                authTokenService.setToken(res.data.token);
                var currentUser = parseToken(res.data.token);
                $rootScope.$broadcast('currentUser', currentUser);
                return deferred.resolve(currentUser);
            }, function (res) {
                return deferred.reject(res);
            });
            return deferred.promise;
        }

        function logout() {
            authTokenService.setToken();
            // $state.go('login');
        }

        function isAuthenticated() {
            return !!getUser();
        }

        function isAuthorized(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return isAuthenticated() && authorizedRoles.indexOf(getUser().role) !== -1;
        }

        function parseToken(token) {
            if (token) {
                return JSON.parse(atob(token.split('.')[1]));
            } else {
                return null;
            }
        }

        function getUser() {
            var currentUser = authTokenService.getToken();
            if (currentUser) {
                return JSON.parse(atob(currentUser.split('.')[1]));
            } else {
                return null;
            }
        }
    }
})();
'use strict';

(function () {
  'use strict';

  angular.module('waitrApp').factory('authTokenService', authTokenService);

  authTokenService.$inject = ['$window'];

  function authTokenService($window) {
    return {

      setToken: setToken,
      getToken: getToken

    };

    //////////////////

    function setToken(token) {
      if (token) {
        $window.localStorage.setItem('token', token);
        return token;
      } else {
        $window.localStorage.removeItem('token');
      }
    }

    function getToken() {
      return $window.localStorage.getItem('token');
    }
  }
})();
'use strict';

(function () {
  angular.module('waitrApp').service('restaurantService', ['$http', 'SERVER_URL', restaurantService]);

  function restaurantService($http, SERVER_URL) {

    this.notification = function (obj) {
      return $http.put(SERVER_URL + '/api/twilio', obj).then(function (response) {
        return response.data;
      });
    };

    this.getRestaurants = function () {
      return $http.get(SERVER_URL + '/api/restaurant').then(function (response) {
        return response.data;
      });
    };

    this.getCurrentRestaurant = function (id) {
      return $http.get(SERVER_URL + '/api/restaurant/' + id).then(function (response) {
        return response.data;
      });
    };

    this.updateRestaurant = function (id, obj) {
      return $http.put(SERVER_URL + '/api/restaurant/' + id, obj).then(function (response) {
        return response.data;
      });
    };

    this.updateRestaurantMenu = function (id, menuObj) {
      return $http.put(SERVER_URL + '/api/restaurant/menu/add/' + id, menuObj).then(function (response) {
        return response.data;
      });
    };

    this.deleteRestaurantMenuItem = function (id, item) {
      return $http.put(SERVER_URL + '/api/restaurant/menu/remove/' + id, item).then(function (response) {
        return response.data;
      });
    };

    this.getWaitlist = function (waitListId) {
      return $http.get(SERVER_URL + '/api/waitlist/?restaurant_id=' + waitListId).then(function (response) {
        return response.data;
      });
    };
  }
})();
'use strict';

(function () {
  angular.module('waitrApp').service('userService', ['$http', 'SERVER_URL', userService]);

  function userService($http, SERVER_URL) {

    this.currentUser = function (id) {
      return $http({
        method: 'GET',
        url: SERVER_URL + '/api/user/' + id
      }).then(function (response) {
        return response.data;
      });
    };

    this.updateUser = function (id, obj) {
      return $http({
        method: 'PUT',
        url: SERVER_URL + '/api/user/' + id,
        data: obj
      }).then(function (response) {
        return response.data;
      });
    };
  }
})();
'use strict';

(function () {
  angular.module('waitrApp').service('waitlistService', waitlistService);

  function waitlistService($http, SERVER_URL) {
    var url = SERVER_URL + "/api/waitlist/";

    this.isValidPhone = function (num) {
      if (num.length != 10) {
        return false;
      }
      num = parseInt(num);
      if (num && num > 1000000000) {
        return true;
      }
      return false;
    };

    this.maxPartySize = 100;

    this.addAnonToWaitlist = function (user, waitlistId, waitTime) {
      //first, we need to structure our data in a way that the server will accept
      var newListEntry = {
        firstName: user.firstName,
        lastName: user.lastName,
        partySize: user.partySize,
        phone: user.phone,
        timeAdded: new Date(),
        quotedTimeGiven: waitTime,
        notes: user.notes
      };

      if (user.user_id) {
        newListEntry.user_id = user.user_id;
      }

      //now submit this as the data to the waitlist id on the restaurantInfo object
      return $http({
        method: "PUT",
        url: url + waitlistId + "/list",
        data: newListEntry
      }).then(function (res) {
        return res.data;
      });
    };

    this.getOneFromWaitlist = function (userId, waitlistId) {
      return $http({
        method: "GET",
        url: url + waitlistId + "/list/" + userId
      }).then(function (res) {
        return res.data;
      });
    };

    this.removeFromWaitlist = function (userId, waitlistId) {
      return $http({
        method: "DELETE",
        url: url + waitlistId + "/list/" + userId
      }).then(function (res) {
        //console.log("hitting return");
        return res.data;
      });
    };

    this.updateWaitlistEntry = function (userId, waitlistId, body) {
      delete body._id;
      return $http({
        method: "PUT",
        url: url + waitlistId + "/list/" + userId,
        data: body
      }).then(function (res) {
        return res.data;
      });
    };

    this.updateWaitTime = function (waitlistId, time) {
      return $http({
        method: "PUT",
        url: url + waitlistId,
        data: { quotedTime: time }
      }).then(function (res) {
        //console.log(res.data.quotedTime);
        return res.data.quotedTime;
      });
    };
    this.getWaitlist = function (waitListId) {
      return $http.get(url + '?restaurant_id=' + waitListId).then(function (response) {
        return response.data;
      });
    };
  }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('RestaurantController', ['restaurantInfo', RestaurantController]);

    function RestaurantController(restaurantInfo) {

        var vm = this;

        vm.currentUser = restaurantInfo.currentUser;
        vm.restaurant = restaurantInfo.restaurant[0];
    }
})();
'use strict';

(function () {
    angular.module('waitrApp').controller('CustomerHomeController', ['restaurantService', CustomerHomeController]);

    function CustomerHomeController(restaurantService) {
        var vm = this;

        vm.reverse = false;

        restaurantService.getRestaurants().then(function (restaurant) {
            return vm.restaurantList = restaurant;
        });
    }
})();
'use strict';

(function () {
    angular.module('waitrApp').controller('custRestaurantMenuCtrl', ['restaurantService', '$stateParams', '$ionicHistory', '$state', custRestaurantMenuCtrl]);

    function custRestaurantMenuCtrl(restaurantService, $stateParams, $ionicHistory, $state) {
        var cmc = this;
        cmc.restaurantId = $stateParams.restaurantId;
        cmc.menuTitle = null;

        restaurantService.getCurrentRestaurant(cmc.restaurantId).then(function (restaurant) {
            cmc.restaurant = restaurant[0];
            cmc.groupedMenu = _.groupBy(cmc.restaurant.menu, 'section');
        });

        cmc.goBack = function () {
            $ionicHistory.goBack();
        };

        cmc.toggleSection = function (key) {
            if (key === cmc.menuTitle) {
                cmc.menuTitle = null;
            } else {
                cmc.menuTitle = key;
            }
        };
    }
})();
'use strict';

(function () {
    angular.module('waitrApp').controller('CustomerRestaurantController', ['restaurantService', 'userService', 'waitlistService', '$stateParams', '$ionicHistory', '$state', '$scope', CustomerRestaurantController]);

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

        restaurantService.getCurrentRestaurant(vm.restaurantId).then(function (restaurant) {
            return vm.restaurant = restaurant[0];
        });

        waitlistService.getWaitlist(vm.restaurantId).then(function (res) {
            return vm.customerEntries = res[0];
        });

        vm.userAddingToQ = function () {
            waitlistService.addAnonToWaitlist(vm.currentUser, vm.restaurant.waitlist_id).then(function () {

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                $state.go("restaurant.home");
            });
        };

        vm.callTel = function () {
            return window.location.href = 'tel:' + vm.restaurant.restaurantPhone;
        };

        vm.getWebsite = function () {
            window.open(vm.restaurant.restaurantWebsite, '_system', 'location=yes');
            return false;
        };

        vm.goBack = function () {
            return $ionicHistory.goBack();
        };

        vm.infoHoursToggle = true;
        vm.showOnClick = function (value) {
            return vm.infoHoursToggle = value;
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('CustomerWaitlistConfirmController', ['$stateParams', '$scope', 'waitlistService', 'restaurantService', '$state', 'userService', '$ionicHistory', CustomerWaitlistConfirmController]);

    function CustomerWaitlistConfirmController($stateParams, $scope, waitlistService, restaurantService, $state, userService, $ionicHistory) {

        var vm = this,
            currRest = $stateParams.restaurantId,
            socket = io.connect('http://localhost:3000');

        vm.currentUser = $scope.ccc.currentUser;

        restaurantService.getCurrentRestaurant(currRest).then(function (data) {
            return vm.currRestObj = data;
        });

        vm.userAddingToQ = function (firstname, lastname, partysize, phone, notes) {
            var person = {
                user_id: vm.currentUser._id,
                firstName: firstname,
                lastName: lastname,
                partySize: partysize,
                phone: phone,
                notes: notes
            };

            waitlistService.addAnonToWaitlist(person, vm.currRestObj[0].waitlist_id).then(function (newPerson) {

                socket.emit('newPerson', newPerson);

                $ionicHistory.nextViewOptions({
                    disableBack: true
                });

                var waitlistId = {
                    inWaitList: vm.currRestObj[0].waitlist_id
                };

                userService.updateUser(vm.currentUser._id, waitlistId).then(function () {
                    $scope.ccc.currentUser.inWaitList = waitlistId.inWaitList;
                    $state.go("customer.waitlist");
                });
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('CustomerSettingsController', ['userService', '$state', '$scope', CustomerSettingsController]);

    function CustomerSettingsController(userService, $state, $scope) {

        var vm = this;

        vm.currentUser = $scope.ccc.currentUser;
        vm.firstName = vm.currentUser.firstName;
        vm.lastName = vm.currentUser.lastName;
        vm.phone = vm.currentUser.phone;
        vm.email = vm.currentUser.email;

        vm.updateUser = function (firstName, lastName, phone, email) {

            var user = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email
            };

            userService.updateUser(vm.currentUser._id, user).then(function (updateUser) {
                $scope.ccc.currentUser = updateUser;
                $state.go('customer.settings');
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('CustomerWaitlistController', ['userService', 'restaurantService', '$scope', 'waitlistService', '$ionicPopup', '$state', '$ionicHistory', CustomerWaitlistController]);

    function CustomerWaitlistController(userService, restaurantService, $scope, waitlistService, $ionicPopup, $state, $ionicHistory) {

        var vm = this;
        var socket = io.connect('http://localhost:3000');

        vm.currentUser = $scope.ccc.currentUser;

        socket.on('newPersonAdded', function (data) {
            vm.currentUser.inWaitList.list.push(data);
            $scope.$apply();
        });

        socket.on('deletedPerson', function (data) {
            if (vm.currentUser.inWaitList) {
                vm.currentUser.inWaitList.list.splice(data.pos, 1);
                $scope.$apply();
            }
        });

        userService.currentUser(vm.currentUser._id).then(function (user) {
            vm.currentUser = user[0];

            restaurantService.getCurrentRestaurant(vm.currentUser.inWaitList.restaurant_id).then(function (data) {
                return vm.restaurant = data[0];
            });
        });

        vm.removeFromWaitlist = function () {
            var list = vm.currentUser.inWaitList.list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].user_id == vm.currentUser._id) {
                    waitlistService.removeFromWaitlist(list[i]._id, vm.currentUser.inWaitList._id).then(function (res) {
                        $scope.ccc.currentUser.inWaitList = undefined;
                        socket.emit('deletePerson', res);
                        $ionicHistory.nextViewOptions({
                            disableBack: true
                        });
                        $state.go("customer.home");
                    });
                }
            }
        };

        vm.showRemovePopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Remove from waitlist",
                template: "WARNING: this will remove you from the list"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    vm.removeFromWaitlist();
                }
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('RestaurantEditController', ['waitlistService', '$state', "$ionicHistory", "$stateParams", "$ionicPopup", 'restaurantService', '$scope', RestaurantEditController]);

    function RestaurantEditController(waitlistService, $state, $ionicHistory, $stateParams, $ionicPopup, restaurantService, $scope) {

        var socket = io.connect('http://localhost:3000');
        var vm = this;

        vm.currentRestaurant = $scope.rrc.restaurant;

        waitlistService.getOneFromWaitlist($stateParams.person, $stateParams.waitlist).then(function (res) {
            vm.person = res;
        });

        vm.notification = function () {
            var obj = {
                phone: '+1' + vm.person.phone,
                firstName: vm.person.firstName,
                restaurant: vm.currentRestaurant.restaurantName
                //message: vm.message
            };
            console.log('this is the phone number', obj.phone);
            restaurantService.notification(obj);
        };

        vm.submitEditedEntry = function (person) {
            console.log("vm.person is: ", person);
            waitlistService.updateWaitlistEntry($stateParams.person, $stateParams.waitlist, person).then(function (res) {
                console.log("successfully updated entry!");

                $state.go("restaurant.home");
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            });
        };

        var removeFromWaitlist = function removeFromWaitlist() {
            waitlistService.removeFromWaitlist($stateParams.person, $stateParams.waitlist).then(function (res) {
                socket.emit('deletePerson', res);
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("restaurant.home");
            });
        };

        vm.showCheckInPopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Check in user",
                template: "Are you sure you want to check in this user?"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to check person in");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to check person in");
                }
            });
            $state.go("restaurant.home");
        };

        vm.showCheckInPopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Check in user",
                template: "Are you sure you want to check in this user?"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to check person in");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to check person in");
                }
            });
        };

        vm.showRemovePopup = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: "Remove from waitlist",
                template: "WARNING: this will remove the user from the waitlist entirely"
            });

            confirmPopup.then(function (res) {
                if (res) {
                    console.log("user wants to remove person from list");
                    removeFromWaitlist();
                } else {
                    console.log("user does not want to remove person from list");
                }
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('RestaurantHomeController', ['waitlistService', '$state', "$ionicHistory", '$scope', '$ionicPopup', RestaurantHomeController]);

    function RestaurantHomeController(waitlistService, $state, $ionicHistory, $scope, $ionicPopup) {
        var vm = this;

        vm.newPerson = {};

        var socket = io.connect('http://localhost:3000');

        socket.on('newPersonAdded', function (data) {
            vm.customerEntries.list.push(data);
            $scope.$apply();
        });

        socket.on('deletedPerson', function (data) {
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

        waitlistService.getWaitlist(vm.currentUser.restaurant_id).then(function (res) {
            return vm.customerEntries = res[0];
        });

        vm.addPersonToQ = function (newQPerson) {
            if (newQPerson.firstName && newQPerson.lastName && newQPerson.phone && newQPerson.partySize) {
                if (waitlistService.isValidPhone(newQPerson.phone) && newQPerson.partySize < waitlistService.maxPartySize) {
                    waitlistService.addAnonToWaitlist(newQPerson, vm.customerEntries._id, vm.customerEntries.quotedTime).then(function (res) {
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
                        buttons: [{ text: "OK" }]
                    });
                }
            } else {
                $ionicPopup.show({
                    title: "Invalid Data",
                    template: "Fill out all fields before pressing 'Submit'",
                    buttons: [{ text: "OK" }]
                });
            }
        };

        vm.showWaitTimeModal = function (time) {
            vm.time = time;
            var myPopup = $ionicPopup.confirm({
                template: '<label class="item item-input"><input type="tel" ng-model="vm.time" min="0"></label>',
                title: "Enter Wait Time",
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function onTap(e) {
                        vm.time = parseInt(vm.time);
                        if (vm.time < 0 || isNaN(vm.time)) {
                            e.preventDefault();
                        } else {
                            return vm.time;
                        }
                    }
                }]
            }).then(function (res) {
                if (res >= 0) {
                    waitlistService.updateWaitTime(vm.customerEntries._id, res).then(function (res) {
                        vm.customerEntries.quotedTime = res;
                    });
                }
            });
        };
    }
})();
'use strict';

(function () {
  angular.module('waitrApp').controller('restaProfileCtrl', ['waitlistService', '$scope', 'userService', restaProfileCtrl]);

  function restaProfileCtrl(waitlistService, $scope, userService) {

    var rpc = this;
    rpc.infoHoursToggle = true;
    rpc.currentUser = $scope.rrc.currentUser;
    rpc.restaurant = $scope.rrc.restaurant;

    waitlistService.getWaitlist(rpc.currentUser.restaurant_id).then(function (res) {
      rpc.customerEntries = res[0];
    });

    rpc.callTel = function () {
      window.location.href = 'tel:' + rpc.restaurant.restaurantPhone;
    };
    rpc.getWebsite = function () {
      window.open(rpc.restaurant.restaurantWebsite, '_system', 'location=yes');return false;
    };

    rpc.infoHoursToggle = true;
    rpc.showOnClick = function (value) {
      rpc.infoHoursToggle = value;
    };
  };
})();
'use strict';

(function () {
    'use strict';

    angular.module('waitrApp').controller('RestaurantSettingsController', ['restaurantService', '$scope', '$filter', RestaurantSettingsController]).directive('formattedTime', function ($filter) {

        return {
            require: '?ngModel',
            link: function link(scope, elem, attr, ngModel) {
                if (!ngModel) return;
                if (attr.type !== 'time') return;

                ngModel.$formatters.unshift(function (value) {
                    return value.replace(/:[0-9]+.[0-9]+$/, '');
                });
            }

        };
    });

    function RestaurantSettingsController(restaurantService, $scope, $filter) {

        var vm = this;

        vm.currentUserID = $scope.rrc.currentUser.restaurant_id;
        vm.restaurant = $scope.rrc.restaurant;

        console.log('restaurant', vm.restaurant);

        vm.restaurant.hours.monday.openTime = new Date(vm.restaurant.hours.monday.openTime);
        vm.restaurant.hours.monday.closeTime = new Date(vm.restaurant.hours.monday.closeTime);
        vm.restaurant.hours.tuesday.openTime = new Date(vm.restaurant.hours.tuesday.openTime);
        vm.restaurant.hours.tuesday.closeTime = new Date(vm.restaurant.hours.tuesday.closeTime);
        vm.restaurant.hours.wednesday.openTime = new Date(vm.restaurant.hours.wednesday.openTime);
        vm.restaurant.hours.wednesday.closeTime = new Date(vm.restaurant.hours.wednesday.closeTime);
        vm.restaurant.hours.thursday.openTime = new Date(vm.restaurant.hours.thursday.openTime);
        vm.restaurant.hours.thursday.closeTime = new Date(vm.restaurant.hours.thursday.closeTime);
        vm.restaurant.hours.friday.openTime = new Date(vm.restaurant.hours.friday.openTime);
        vm.restaurant.hours.friday.closeTime = new Date(vm.restaurant.hours.friday.closeTime);
        vm.restaurant.hours.saturday.openTime = new Date(vm.restaurant.hours.saturday.openTime);
        vm.restaurant.hours.saturday.closeTime = new Date(vm.restaurant.hours.saturday.closeTime);
        vm.restaurant.hours.sunday.openTime = new Date(vm.restaurant.hours.sunday.openTime);
        vm.restaurant.hours.sunday.closeTime = new Date(vm.restaurant.hours.sunday.closeTime);

        vm.updateRestaurant = function (restaurant) {
            return restaurantService.updateRestaurant(vm.restaurant._id, restaurant);
        };
    }
})();