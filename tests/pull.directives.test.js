"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('pull', function () {
  beforeEach(module("ngPull"));

  var $compile,
    $rootScope,
    $window,
    pullService;

  beforeEach(inject(function (_$compile_, _$rootScope_, _$window_, _ngPullService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $window = _$window_;
    pullService = _ngPullService_;
  }));

  describe("horizontal directives", function () {
    var template = [
            '<div style="width:100px; height:100px;" pull-left-timeout="{{timeout}}" on-pull-left="onPull($reset)" on-pull-right="false" pull-right-disabled="rightDisabled">',
              '<div pull-left-container></div>',
              '<div pull-target></div>',
              '<div pull-right-container></div>',
            '</div>'].join('');

    it("should init", function () {
      $rootScope.timeout = 200;
      var element = $compile(template)($rootScope);
      $rootScope.rightDisabled = true;
      $rootScope.$digest(); // process all directives
      $rootScope.rightDisabled = false;
      $rootScope.$digest();
      $rootScope.rightDisabled = true;
      $rootScope.$pullRightController.suspended = true;
      $rootScope.$digest();
      pullService.$$rAF.flush()
      $rootScope.$digest();
    });

    it("should ignore all other buttons except left", function() {
      $rootScope.timeout = 200;
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:10, clientY:20, button:1}));
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:10, clientY:20, button:2}));
      $rootScope.$digest();
      expect($rootScope.$pullLeftController.suspended).toEqual(false);
      expect($rootScope.$pullRightController.suspended).toEqual(false);
    });
    it("should respond to events and invoke pull-left callback", function() {
      $rootScope.timeout = 200;
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      var pulledLeft = false;
      $rootScope.onPull = function(){
        pulledLeft = true;
      };
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:200, clientY:20, button:0}));
      expect($rootScope.$pullLeftController.suspended).toEqual(true);
      expect($rootScope.$pullRightController.suspended).toEqual(true);
      $rootScope.$digest();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:180, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress>0).toEqual(true);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:150, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress===50).toEqual(true);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:130, clientY:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:120, clientY:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:110, clientY:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:100, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(100);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:80, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(100);
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientX:80, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(0);

      expect(pulledLeft).toBe(true);
    });
    it("should respond to events, cancel gesture upon move due to timeout and not invoke pull-left callback", function() {
      $rootScope.timeout = -1;
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      var pulledLeft = false;
      $rootScope.onPull = function(){
        pulledLeft = true;
      };
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:200, clientY:20, button:0}));
      expect($rootScope.$pullLeftController.suspended).toEqual(true);
      expect($rootScope.$pullRightController.suspended).toEqual(true);
      $rootScope.$digest();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:199, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(0);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:158, clientY:20, button:0})); // should not affect progress
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(0);
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientX:80, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(0);

      expect(pulledLeft).toBe(false);
    });

    it("should respond to events, cancel gesture upon move due to timeout, remove no-select class and not invoke pull-left callback", function() {
      $rootScope.timeout = -1;
      // modify template and remove pull right gesture
      var element = $compile(template.replace('on-pull-right="false" pull-right-disabled="rightDisabled"','').replace('pull-right-container',''))($rootScope);
      var target = angular.element($window);
      var pulledLeft = false;
      $rootScope.onPull = function(){
        pulledLeft = true;
      };
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientX:200, clientY:20, button:0}));
      expect($rootScope.$pullLeftController.suspended).toEqual(true);
      expect($rootScope.$pullRightController).not.toBeDefined();
      $rootScope.$digest();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:199, clientY:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullLeftProgress).toEqual(0);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientX:158, clientY:20, button:0})); // should not affect progress nor reach target

      expect(function(){pullService.$$rAF.flush();}).toThrowError("No rAF callbacks present");

      expect($rootScope.$pullLeftProgress).toEqual(0);
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientX:80, clientY:20, button:0})); // should not affect progress nor reach target
      expect(function(){pullService.$$rAF.flush();}).toThrowError("No rAF callbacks present");
      expect($rootScope.$pullLeftProgress).toEqual(0);

      expect(pulledLeft).toBe(false);
    });
  });
  describe("vertical directives", function () {
    var template = [
            '<div on-pull-up="onPull($reset)" on-pull-down="false">',
              '<div pull-down-container></div>',
              '<div pull-target></div>',
              '<div pull-up-container></div>',
            '</div>'].join('');

    it("should init", function () {
      var element = $compile(template)($rootScope);
      $rootScope.upDisabled = true;
      $rootScope.$digest(); // process all directives
      $rootScope.upDisabled = false;
      $rootScope.$digest();
      $rootScope.upDisabled = true;
      $rootScope.$pullUpController.suspended = true;
      $rootScope.$digest();
    });
    it("should respond to events and invoke pull-up callback", function() {
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      var pulledUp = false;
      var resetFn;
      $rootScope.onPull = function($reset){
        pulledUp = true;
        resetFn = $reset;
        return false;
      };
      $rootScope.$digest();
      $rootScope.$pullUpController.suspended = false;
      element[0].dispatchEvent(new MouseEvent("mousedown",{clientY:200, clientX:20, button:0}));
      expect($rootScope.$pullUpController.suspended).toEqual(true);
      expect($rootScope.$pullDownController.suspended).toEqual(true);
      $rootScope.$digest();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:180, clientX:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress>0).toEqual(true);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:150, clientX:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress===50).toEqual(true);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:130, clientX:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:120, clientX:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:110, clientX:20, button:0}));
      pullService.$$rAF.flush();
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:100, clientX:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress).toEqual(100);
      target[0].dispatchEvent(new MouseEvent("mousemove",{clientY:80, clientX:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress).toEqual(100);
      target[0].dispatchEvent(new MouseEvent("mouseup",{clientY:80, clientX:20, button:0}));
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress).toEqual(100); // progress is reset once $reset in invoked

      expect(pulledUp).toBe(true);

      resetFn();
      pullService.$$rAF.flush();
      expect($rootScope.$pullUpProgress).toEqual(0);
    });

  });
});
