(function() {
  var app = angular.module("player", []);

  // TODO: create dataset from FanGraphs. These are from baseball reference.
  // Sadly, I don't see "holds" as a stat anywhere.

  app.directive("batterPanel", ["$http", "$log", function($http, $log) {
    return {
      restrict: "E",
      templateUrl: "batter-panel.html",
      controllerAs: "batterCtrl",
      controller: function($http, $log) {
        var batterPanel = this;
        batterPanel.players = [];
        $http.get("/data/mlb/leagues_MLB_2014-standard-batting_players_standard_batting.csv")
            .success(function(data) {
              $log.info("Batting stats loaded.");
              batterPanel.players = PlayerModel.csvToBatters(data);
            })
            .error(function(err) {
              $log.error("Error loading batting stats: " + err.toString())
            });
      }
    }
  }]);

  app.directive("pitcherPanel", ["$http", "$log", function($http, $log) {
    return {
      restrict: "E",
      templateUrl: "pitcher-panel.html",
      controllerAs: "pitcherCtrl",
      controller: function($http, $log) {
        var pitcherPanel = this;
        pitcherPanel.players = [];
        $http.get("/data/mlb/leagues_MLB_2014-standard-pitching_players_standard_pitching.csv")
            .success(function(data) {
              $log.info("Pitching stats loaded.");
              pitcherPanel.players = PlayerModel.csvToPitchers(data);
            })
            .error(function(err) {
              $log.error("Error loading pitching stats: " + err.toString())
            });
      }

    };
  }]);

})();

