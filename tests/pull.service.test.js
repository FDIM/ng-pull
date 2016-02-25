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
      var ctrl = {
        options:{distance:200}
      };
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientX:0}, {clientX:10})).toEqual(10);
      });
      it("should prepare container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          var span = angular.element(document.createElement('span'));
          div.append(span);
          factory.container.prepare(div, ctrl);
      });
      it("should update container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateX(-200px) translateZ(0px)");
      });
      it("should update target transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.target.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateX(-200px) translateZ(0px)");
      });
    });
    describe('right', function() {
      var factoryName = 'right';
      var ctrl = {
        options:{distance:200}
      };
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientX:0}, {clientX:10})).toEqual(-10);
      });
      it("should prepare container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          var span = angular.element(document.createElement('span'));
          div.append(span);
          factory.container.prepare(div, ctrl);
      });
      it("should update container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateX(200px) translateZ(0px)");
      });
      it("should update target transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.target.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateX(200px) translateZ(0px)");
      });
    });
    describe('up', function() {
      var factoryName = 'up';
      var ctrl = {
        options:{distance:200}
      };
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientY:0}, {clientY:10})).toEqual(10);
      });
      it("should prepare container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.prepare(div, ctrl);
      });
      it("should update container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateY(0px) translateZ(0px)");
          expect(div[0].style.height).toEqual("200px");
      });
      it("should update target transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.target.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateY(0px) translateZ(0px)");
      });
    });
    describe('down', function() {
      var factoryName = 'down';
      var ctrl = {
        options:{distance:200}
      };
      it("can begin", function() {
        var factory = service.getFactory(factoryName);
        var dummy = angular.element(document.createElement('div'));
        expect(factory.canBegin(dummy)).toBe(true);
      });
      it("distance check", function() {
        var factory = service.getFactory(factoryName);
        expect(factory.distance({clientY:0}, {clientY:10})).toEqual(-10);
      });
      it("should prepare container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.prepare(div, ctrl);
      });
      it("should update container transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.container.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateY(200px) translateZ(0px)");
      });
      it("should update target transform", function () {
          var factory = service.getFactory(factoryName);
          var div = angular.element(document.createElement('div'));
          factory.target.update(div, 100, ctrl);
          expect(div[0].style.transform).toEqual("translateY(200px) translateZ(0px)");
      });
    });
  });
  it("invokeOncePerFrame should work", function(){
    var callCount = 0;
    var debounced = service.invokeOncePerFrame(function() {
      callCount++;
    });
    expect(debounced).toBeDefined();

    expect(callCount).toBe(0);
    debounced();
    expect(callCount).toBe(0);
    service.$$rAF.flush();
    expect(callCount).toBe(1);
    debounced();
    debounced();
    debounced();
    debounced();
    expect(callCount).toBe(1);
    service.$$rAF.flush();
    expect(callCount).toBe(2);
  });

  it("normalizeEvent should work with touch event", function(){
    var ev = {touches:[{clientX:12, clientY:12}]};
    service.normalizeEvent(ev);
    expect(ev.clientX).toEqual(12);
    expect(ev.clientY).toEqual(12);
  });

  it("normalizeEvent should work with jquery wrapper event", function(){
    var ev = {originalEvent:{touches:[{clientX:12, clientY:12}]}};
    service.normalizeEvent(ev);
    expect(ev.originalEvent.clientX).toEqual(12);
    expect(ev.originalEvent.clientY).toEqual(12);
  });

});
