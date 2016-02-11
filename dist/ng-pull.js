"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPull", ["ngOnPull", "ngPullContainer", "ngPullService"])));

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
        return newEvent.clientX - oldEvent.clientX;
      },
      cssProp:'margin-left'
    },
    right:{
      canBegin: function(element) {
        return element.prop('scrollLeft') === element.prop('scrollWidth') - element.prop('clientWidth');
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientX - newEvent.clientX;
      },
      cssProp:'margin-right'
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

"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {

  module.directive('pullDownContainer', ['ngPullService', getDirective('down')]);
  module.directive('pullUpContainer', ['ngPullService', getDirective('up')]);
  module.directive('pullLeftContainer', ['ngPullService', getDirective('left')]);
  module.directive('pullRightContainer', ['ngPullService', getDirective('right')]);

  function getDirective(direction) {
    var capitalizedDirection = direction[0].toUpperCase() + direction.slice(1);

    return PulledContainer;

    function PulledContainer(pullService){
        var factory = pullService.getFactory(direction);
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
}(angular.module("ngPullContainer",[])));
