"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (app) {
  app.controller("AppController", ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
      $scope.items = [];
      $scope.history = [];
      $scope.loadNewItems = function() {
        $scope.history.push("load new items");
      }
      $scope.loadMoreItems = function(cancel) {
        $scope.history.push("loading more items");
        $timeout(function() {
          cancel();
          $scope.history.push("loaded more items");
        }, 2000);
        return false;
      }
      for(var i =0; i< 100; i++){
        $scope.items.push({title:"item "+i, intro:'intro '+i});
      }
  }]);

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("app", ['ngPuller'])));
