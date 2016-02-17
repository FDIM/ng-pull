"use strict";
/**
 * Each module has a <moduleName>.module.js file.  This file contains the angular module declaration -
 * angular.module("moduleName", []);
 * The build system ensures that all the *.module.js files get included prior to any other .js files, which
 * ensures that all module declarations occur before any module references.
 */
(function (module) {
  var TRANSLATEZ_SUFFIX = 'translateZ(0)';
  module.service('ngPullService', ['$$rAF',PullService]);
  var FACTORIES = {
    down:{
      canBegin: function(element) {
        // stays in top
        return Math.floor(element.prop('scrollTop')) === 0;
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientY - oldEvent.clientY;
      },
      container:{
        prepare:function(element, ctrl) {

        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateY('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateY('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    },
    up:{
      canBegin: function(element) {
        return Math.round(element.prop('scrollTop')) === Math.round(element.prop('scrollHeight') - element.prop('clientHeight'));
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientY - newEvent.clientY;
      },
      container:{
        prepare:function(element, ctrl) {

        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = 'translateY('+(ctrl.options.distance-progress / 100 * ctrl.options.distance)+'px)translateZ(0)';
          element[0].style.height = (progress / 100 * ctrl.options.distance)+'px';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = 'translateY('+(ctrl.options.distance-progress / 100 * ctrl.options.distance)+'px)translateZ(0)';
        }
      }
    },
    left:{
      canBegin: function(element) {
        return Math.floor(element.prop('scrollLeft')) === 0;
      },
      distance: function(newEvent, oldEvent) {
        return oldEvent.clientX - newEvent.clientX;
      },
      container:{
        prepare:function(element, ctrl) {
          element.children()[0].style.width = ctrl.options.distance + 'px';
        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(-progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(-progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    },
    right:{
      canBegin: function(element) {
        return Math.round(element.prop('scrollLeft')) === Math.round(element.prop('scrollWidth') - element.prop('clientWidth')-120);
      },
      distance: function(newEvent, oldEvent) {
        return newEvent.clientX - oldEvent.clientX;
      },
      container:{
        prepare:function(element, ctrl) {
          element.children()[0].style.width = ctrl.options.distance + 'px';
        },
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      },
      target:{
        update:function(element, progress, ctrl) {
          element[0].style['transform'] = progress>0?'translateX('+(progress / 100 * ctrl.options.distance)+'px)'+TRANSLATEZ_SUFFIX:'';
        }
      }
    }
  };

  function PullService($$rAF) {
    this.$factories = FACTORIES;
    this.$$rAF = $$rAF;
  }

  PullService.prototype.getFactory = function(direction) {
    return FACTORIES[direction];
  }
  // taken from angular material: https://github.com/angular/material/blob/67e50f6e51b3e0282c086d9bb7760661c8135bbf/src/core/core.js
  PullService.prototype.invokeOncePerFrame = function(cb) {
    var queuedArgs, alreadyQueued, queueCb, context, self;
    self = this;
    return function debounced() {
      queuedArgs = arguments;
      context = this;
      queueCb = cb;
      if (!alreadyQueued) {
        alreadyQueued = true;
        self.$$rAF(function() {
          queueCb.apply(context, Array.prototype.slice.call(queuedArgs));
          alreadyQueued = false;
        });
      }
    };
  };
  // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("ngPullService", [])));
