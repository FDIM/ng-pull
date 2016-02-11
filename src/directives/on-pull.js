"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var EVENTS = {
    start:'mousedown touchstart',
    move:'mousemove touchmove',
    end: 'mouseup touchend'
  };

  module.directive('onPullDown', ['ngPullService', '$window', getDirective('down')]);
  module.directive('onPullUp', ['ngPullService', '$window', getDirective('up')]);
  module.directive('onPullLeft', ['ngPullService', '$window', getDirective('left')]);
  module.directive('onPullRight', ['ngPullService', '$window', getDirective('right')]);

  function getDirective(direction) {
    //var directiveName = "on-pull-"+direction;
    var activeClassName = "pull-"+direction+'-active';
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);
    var defaultOptions = {
      Distance: 100,
      Progress:'$pull' + capitalizedDirection + 'Progress',
      Duration: 450,
      Timeout:300,
      Treshold: 5
    };
    return OnPullDirective;

    function OnPullDirective(pullService, $window){
        var progress = 0;
        var initialEvent;
        var factory = pullService.getFactory(direction);
        return {
          controller: controller,
          link: link
        };
        function controller(){
          this.queue = [];
        }

        function link(scope, element, attr, ctrl) {
          var options = normalizeOptions(attr);
          var eventTarget = angular.element($window);
          ctrl.options = options;
          ctrl.suspended = false;
          ctrl.queue.forEach(function(fn) {
            fn();
          });
          var startTime;
          element.on(EVENTS.start, pointerDown);

          function pointerDown(ev) {
            if(factory.canBegin(element) && !ctrl.suspended){
              eventTarget.on(EVENTS.move, pointerMove);
              eventTarget.on(EVENTS.end, pointerUp);
              initialEvent = ev;
              startTime = Date.now();
              ctrl.suspended = true;
            }
          }

          function pointerMove(ev){
            var percent = factory.distance(ev, initialEvent) * 100.0 / (1.0 * options.distance);
            // cancel intention if user drags below certain treshold until timeout
            if(percent <= options.treshold && Date.now() - startTime > options.timeout){
              eventTarget.off(EVENTS.move, pointerMove);
              eventTarget.off(EVENTS.end, pointerUp);
              element.removeClass(activeClassName);
              ctrl.suspended = false;
              progress = 0;
            }
            if (percent < 0) {
              percent = 0;
            }
            if (percent > 1) {
              element.addClass(activeClassName);
              if (percent > 100) {
                percent = 100;
              }
            }
            scope.$eval(options.progress+'=value',{
              value: percent
            });
            // special case for up and right
            if(direction === 'up'){
              element.prop('scrollTop',element.prop('scrollTop')+options.distance);
            }
            scope.$apply();
          }

          function pointerUp(ev){
            eventTarget.off(EVENTS.move, pointerMove);
            eventTarget.off(EVENTS.end, pointerUp);
            element.removeClass(activeClassName);
            // execute expression and depending on its outcome revert progress
            // no expression = always revert progress when gesture is done
            if(options.expression && scope.$eval(options.progress)>=100){
                if(scope.$eval(options.expression, {$callback:revertProgress})!==false) {
                  revertProgress();
                }
            } else {
              revertProgress();
            }
            scope.$apply();
          }
          function revertProgress() {
              scope.$eval(options.progress+'=0');
              ctrl.suspended = false;
          }

        }
    }

    function normalizeOptions(attr) {
      var options = {};
      for(var key in defaultOptions){
        options[key.toLowerCase()] = attr['pull'+capitalizedDirection+key] || defaultOptions[key];
      }
      options.expression = attr['onPull'+capitalizedDirection];
      return options;
    }
  }

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngOnPull",[])));
