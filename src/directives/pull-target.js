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
      require:['?^onPullLeft','?^onPullRight', '?^onPullDown','?^onPullUp'],
      link: link
    };

    function link(scope, element, attr, controllers) {
      element.addClass('pull-target');
      // go throught each possible controller, wait until directive is ready and create watcher that will update DOM element
      controllers.forEach(function(pullCtrl, index){
        if(pullCtrl){
          pullCtrl.queue.push(function(factory){
            scope.$watch(pullCtrl.options.progress, function(newValue) {
              factory.target.update(element, newValue, pullCtrl);
            })
          });
        }
      });
    }
  }
    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullTarget",[])));
