(function () {
    'use strict';
    angular
        .module('waitrApp')
        .service('waitlistService', waitlistService);

    function waitlistService($http, SERVER_URL) {
        const url = `${SERVER_URL}/api/waitlist/`;

        this.isValidPhone = (num) => {
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

        this.addAnonToWaitlist = (user, waitlistId, waitTime) => {
            //first, we need to structure our data in a way that the server will accept
            const newListEntry = {
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
            return $http.put(`${url}${waitlistId}/list`, newListEntry).then(respond => respond.data)
        };

        this.getOneFromWaitlist = (userId, waitlistId) => $http.get(`${url}${waitlistId}/list/${userId}`).then(respond => respond.data);

        this.removeFromWaitlist = (userId, waitlistId) => $http.delete(`${url}${waitlistId}/list/${userId}`).then(respond => respond.data);

        this.updateWaitlistEntry = (userId, waitlistId, body) => {
            delete body._id;
            return $http.put(`${url}${waitlistId}/list/${userId}`, body).then(response => response.data)
        };

        this.updateWaitTime = (waitlistId, time) => $http.put(`${url}waitlistId`, {quotedTime: time}).then(response => response.data.quotedTime);

        this.getWaitlist = (waitListId) => $http.get(`${url}?restaurant_id=${waitListId}`).then(response => response.data);
    }

})();