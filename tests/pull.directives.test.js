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
    pullService;

  beforeEach(inject(function (_$compile_, _$rootScope_, _ngPullService_) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    pullService = _ngPullService_;
  }));

  describe("horizontal", function () {
    var template = [
            '<div on-pull-left="false" on-pull-right="false" pull-right-disabled="rightDisabled">',
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

    it("should respond to events", function() {
      var element = $compile(template)($rootScope);
      $rootScope.$digest();
      $rootScope.$pullLeftController.suspended = false;
      element.triggerHandler('mousedown');
      element.triggerHandler('mousemove');
      element.triggerHandler('mouseup');
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
