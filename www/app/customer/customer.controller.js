(function () {
    'use strict';
    angular
        .module('waitrApp')
        .controller('CustomerController', ['currentUser', CustomerController]);

    function CustomerController(currentUser) {

        const vm = this;

        vm.currentUser = currentUser;
    }
})();
