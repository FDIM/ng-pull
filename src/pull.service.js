"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  module.service('ngPullService', PullService);
  var FACTORIES = {
    down:{
      canBegin: function(element) {
        // stays in top
        return element.prop('scrollTop') === 0;
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientY - oldEvent.clientY;
      },
      cssProp:'margin-top'
    },
    up:{
      canBegin: function(element) {
        return element.prop('scrollTop') === element.prop('scrollHeight') - element.prop('clientHeight');
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientY - newEvent.clientY;
      },
      cssProp:'height'
    },
    left:{
      canBegin: function(element) {
        return element.prop('scrollLeft') === 0;
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientX - newEvent.clientX;
      },
      cssProp:'width'
    },
    right:{
      canBegin: function(element) {
        return element.prop('scrollLeft') === element.prop('scrollWidth') - element.prop('clientWidth');
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientX - oldEvent.clientX;
      },
      cssProp:'width'
    }
  };

  function PullService() {
    this.$factories = FACTORIES;
  }

  PullService.prototype.getFactory = function(direction) {
    return FACTORIES[direction];
  }

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullService", [])));
