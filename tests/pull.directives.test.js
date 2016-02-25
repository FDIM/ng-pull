"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('pull directives', function () {
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

  describe("horizontal", function () {
    var template = [
            '<div style="width:100px; height:100px;" on-pull-left="false" on-pull-right="false" pull-right-disabled="rightDisabled">',
              '<div pull-left-container></div>',
              '<div pull-target></div>',
              '<div pull-right-container></div>',
            '</div>'].join('');

    it("should init", function () {
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
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element.triggerHandler(new MouseEvent("mousedown",{clientX:10, clientY:20, button:1}));
      element.triggerHandler(new MouseEvent("mousedown",{clientX:10, clientY:20, button:2}));
      //expect($rootScope.$pullLeftController.suspended).toEqual(false);
      //expect($rootScope.$pullRightController.suspended).toEqual(false);
    });
    it("should respond to events", function() {
      var element = $compile(template)($rootScope);
      var target = angular.element($window);
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element.triggerHandler(new MouseEvent("mousedown",{clientX:10, clientY:20, button:0}));
      expect($rootScope.$pullLeftController.suspended).toEqual(true);
      expect($rootScope.$pullRightController.suspended).toEqual(true);
      $rootScope.$digest();
      target.triggerHandler(new MouseEvent("mousemove",{clientX:14, clientY:20, button:0}));
      $rootScope.$digest();
      //console.info($rootScope.$pullLeftProgress);
      //expect($rootScope.$pullRightProgress>0).toEqual(true);
      target.triggerHandler(new MouseEvent("mousemove",{clientX:24, clientY:20, button:0}));
      $rootScope.$digest();
      target.triggerHandler(new MouseEvent("mousemove",{clientX:50, clientY:20, button:0}));
      $rootScope.$digest();
      target.triggerHandler(new MouseEvent("mousemove",{clientX:90, clientY:20, button:0}));
      $rootScope.$digest();
      target.triggerHandler(new MouseEvent("mousemove",{clientX:100, clientY:20, button:0}));
      $rootScope.$digest();
      target.triggerHandler(new MouseEvent("mouseup",{clientX:100, clientY:20, button:0}));
      $rootScope.$digest();

    });

  });
  describe("vertical", function () {
    var template = [
            '<div on-pull-up="false" on-pull-down="false" pull-up-disabled="upDisabled">',
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
      pullService.$$rAF.flush()
      $rootScope.$digest();
    });

  });
});
