(function() {
    var app = angular.module("MLBRecommender", ["player"]);

    app.controller("PlayerPanelController", function() {
        this.tab = 0;
        this.setTab = function(index) {
            this.tab = index;
        };
        this.isTabSet = function(index) {
            return this.tab == index;
        };
    });

})();