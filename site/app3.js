// app.js

(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective);

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var menu = this;
        menu.searchTerm = ''; // Initialize the search term
        menu.found = [];

        menu.narrowItDown = function () {
            if (menu.searchTerm.trim() === '') {
                // Handle empty search term here, you can display a message
                menu.found = [];
            } else {
                MenuSearchService.getMatchedMenuItems(menu.searchTerm)
                    .then(function (foundItems) {
                        menu.found = foundItems;
                    });
            }
        };

        menu.removeItem = function (index) {
            menu.found.splice(index, 1);
        };
    }

    MenuSearchService.$inject = ['$http'];
    function MenuSearchService($http) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            // Use $http to retrieve menu items from the API
            // The URL for the REST Endpoint is https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json
            // Implement the logic to filter and return matched items here
            return $http({
                method: 'GET',
                url: 'https://coursera-jhu-default-rtdb.firebaseio.com/menu_items.json'
            }).then(function (response) {
                var foundItems = [];
                var menuItems = response.data;

                // Implement the logic to filter menu items based on the search term
                // Add matched items to the foundItems array

                for (var i = 0; i < menuItems.length; i++) {
                    var menuItem = menuItems[i];
                    // Check if the description contains the search term
                    if (menuItem.description.toLowerCase().includes(searchTerm.toLowerCase())) {
                        foundItems.push(menuItem);
                    }
                }
                return foundItems;
            });
        };
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            }
        };

        return ddo;
    }

})();
