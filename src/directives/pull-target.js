"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {

  module.directive('pullTarget',['ngPullService', PullTarget])

  function PullTarget(pullService) {
    return {
      require:['?^onPullLeft','?^onPullRight'],
      link: link
    };

    function link(scope, element, attr, controllers) {
      element.addClass('pull-target');
      controllers.forEach(function(pullCtrl, index){
        if(pullCtrl){
          pullCtrl.queue.push(function(){
            scope.$watch(pullCtrl.options.progress, function(newValue) {
              // swap direction based on controller
              element[0].style['marginLeft'] = (index == 0?-1:1) * (newValue / 100 * pullCtrl.options.distance)+'px';
              // compensate for reduced with or changed position
              element[0].style['marginRight'] = (index == 0?1:-1) * (newValue / 100 * pullCtrl.options.distance)+'px';
            })
          });
        }
      });
    }
  }
    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullTarget",[])));
