(function () {
    'use strict';
    angular
        .module('waitrApp')
        .service('restaurantService', ['$http', 'SERVER_URL', restaurantService]);

    function restaurantService($http, SERVER_URL) {

        this.notification = (obj) => $http.put(`${SERVER_URL}/api/twilio`, obj).then(response => response.data);

        this.getRestaurants = () => $http.get(`${SERVER_URL}/api/restaurant`).then(response => response.data);

        this.getCurrentRestaurant = (id) => $http.get(`${SERVER_URL}/api/restaurant/${id}`).then(response => response.data);

        this.updateRestaurant = (id, obj) => $http.put(`${SERVER_URL}/api/restaurant/${id}`, obj).then(response => response.data);

        this.updateRestaurantMenu = (id, menuObj) => $http.put(`${SERVER_URL}/api/restaurant/menu/add/${id}`, menuObj).then(response => response.data);

        this.deleteRestaurantMenuItem = (id, item) => $http.put(`${SERVER_URL}/api/restaurant/menu/remove/${id}`, item).then(response => response.data);

        this.getWaitlist = (waitListId) => $http.get(`${SERVER_URL}/api/waitlist/?restaurant_id=${waitListId}`).then(response => response.data);

        this.getMenuItem = (restaurantId, menuId) => $http.post(`${SERVER_URL}/api/restaurant/${restaurantId}/menu`, {'menuId': menuId}).then(response => response.data);

    }

})();
