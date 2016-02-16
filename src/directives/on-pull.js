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
  var NO_SELECT_CLASS = 'no-select';

  module.directive('onPullDown', ['ngPullService', '$window', '$document', getDirective('down')]);
  module.directive('onPullUp', ['ngPullService', '$window', '$document', getDirective('up')]);
  module.directive('onPullLeft', ['ngPullService', '$window', '$document', getDirective('left')]);
  module.directive('onPullRight', ['ngPullService', '$window', '$document', getDirective('right')]);

  function getDirective(direction) {
    //var directiveName = "on-pull-"+direction;
    var activeClassName = "pull-"+direction+'-active';
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);
    var defaultOptions = {
      Distance: 100,
      Progress:'$pull' + capitalizedDirection + 'Progress',
      Duration: 450,
      Timeout:300,
      Threshold: 5,
      Disabled: false,
      Reset: '$pull'+capitalizedDirection+'Reset'
    };
    return OnPullDirective;

    function OnPullDirective(pullService, $window, $document){
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
          var selectionTarget = $document.find('body');
          var startTime;
          var wasMoreThanThreshold;
          ctrl.options = options;
          ctrl.suspended = false;
          ctrl.queue.forEach(function(fn) {
            fn();
          });
          scope.$eval(options.reset+'=value',{value:revertProgress});
          if(attr['pull'+capitalizedDirection+'Disabled']){
            scope.$watch(options.disabled, function(disabled){
              if (disabled) {
                element.off(EVENTS.start, pointerDown);
                revertProgress();
              } else {
                element.on(EVENTS.start, pointerDown);
              }
            });
          } else {
            element.on(EVENTS.start, pointerDown);
          }

          function pointerDown(ev) {
            if(factory.canBegin(element) && !ctrl.suspended && (ev.which === 1 || ev.which === 0)) {
              eventTarget.on(EVENTS.move, pointerMove);
              eventTarget.on(EVENTS.end, pointerUp);
              initialEvent = normalizeEvent(ev);
              startTime = Date.now();
              ctrl.suspended = true;
              wasMoreThanThreshold = false;
            }
          }

          function pointerMove(ev){
            var percent = factory.distance(normalizeEvent(ev), initialEvent) * 100.0 / (1.0 * options.distance);
            // cancel intention if user drags below certain threshold until timeout
            if(percent <= options.threshold && Date.now() - startTime > options.timeout && !wasMoreThanThreshold){
              eventTarget.off(EVENTS.move, pointerMove);
              eventTarget.off(EVENTS.end, pointerUp);
              element.removeClass(activeClassName);
              selectionTarget.removeClass(NO_SELECT_CLASS);
              ctrl.suspended = false;
              percent = 0;
            }
            // if user pulled more than threshold, gesture should not be canceled when value becomes less than threshold
            if (percent > options.threshold) {
              wasMoreThanThreshold = true;
              if (direction == 'up' || direction ==='down') {
                ev.preventDefault();
              }
            }
            if (percent < 0) {
              percent = 0;
            }
            if (percent > 1) {
              element.addClass(activeClassName);
              selectionTarget.addClass(NO_SELECT_CLASS);
              if (percent > 100) {
                percent = 100;
              }
            }
            scope.$eval(options.progress+'=value',{
              value: percent
            });
            // special case for up
            if(direction === 'up'){
              element.prop('scrollTop',element.prop('scrollTop')+options.distance);
            }
            // special case for right
            if(direction === 'right'){
              element.prop('scrollLeft',element.prop('scrollLeft')+options.distance);
            }
            scope.$applyAsync();
          }

          function pointerUp(ev){
            eventTarget.off(EVENTS.move, pointerMove);
            eventTarget.off(EVENTS.end, pointerUp);
            element.removeClass(activeClassName);
            selectionTarget.removeClass(NO_SELECT_CLASS);
            // execute expression and depending on its outcome revert progress
            // no expression = always revert progress when gesture is done
            if(options.expression && scope.$eval(options.progress)>=100){
                if(scope.$eval(options.expression, {$reset:revertProgress})!==false) {
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

    function normalizeEvent(ev) {
      // jquery
      if(ev.originalEvent){
        ev = ev.originalEvent;
      }
      if(ev.touches){
        ev.clientX = ev.touches[0].clientX;
        ev.clientY = ev.touches[0].clientY;
      }
      return ev;
    }
  }

  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngOnPull",[])));
