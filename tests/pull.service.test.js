"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('pull service', function () {
  var service;
  beforeEach(module("ngPull"));
  beforeEach(inject(function(_ngPullService_) {
    service = _ngPullService_;
  }));
  describe('factory', function() {
    describe('left', function() {
      var factoryName = 'left';
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientX:0}, {clientX:10})).toEqual(10);
      });
    });
    describe('right', function() {
      var factoryName = 'right';
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientX:0}, {clientX:10})).toEqual(-10);
      });
    });
    describe('up', function() {
      var factoryName = 'up';
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientY:0}, {clientY:10})).toEqual(10);
      });
    });
    describe('down', function() {
      var factoryName = 'down';
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientY:0}, {clientY:10})).toEqual(-10);
      });
    });
  });
  it("invokeOncePerFrame should work", function(){
    var debounced = service.invokeOncePerFrame(function() {
    });
    expect(debounced).toBeDefined();
  });

});
