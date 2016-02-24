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
    $rootScope;

  beforeEach(inject(function (_$compile_, _$rootScope_ ) {
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe("directive", function () {
    var template = [
            '<div>hello ',
                '<span rr="!loggedin">guest</span>',
            '</div>'].join('');

    it("test", function () {
      var element = $compile(template)($rootScope);
      $rootScope.$digest(); // process all directives
      expect(element.text()).toEqual("hello guest");
    });

  });
});
