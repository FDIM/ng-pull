"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {

  module.directive('pullDownContainer', ['ngPullerService', getDirective('down')]);
  module.directive('pullUpContainer', ['ngPullerService', getDirective('up')]);
  module.directive('pullLeftContainer', ['ngPullerService', getDirective('left')]);
  module.directive('pullRightContainer', ['ngPullerService', getDirective('right')]);

  function getDirective(direction) {
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

    return PulledContainer;

    function PulledContainer(pullerService){
        var factory = pullerService.getFactory(direction);
        return {
          require:'^onPull'+capitalizedDirection,
          link:{post:link},
          transclude:true,
          template:'<div ng-transclude></div>'
        };

        function link(scope, element, attr, pullCtrl) {
          pullCtrl.queue.push(function(){
            element.addClass('pull-'+direction+'-container');
            scope.$watch(pullCtrl.options.progress, function(newValue) {
              element[0].style[factory.cssProp] = (newValue / 100 * pullCtrl.options.distance)+'px';
            })
          });
        }
    }
  }
    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullerContainer",[])));
