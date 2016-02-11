"use strict";
/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe('acl', function () {
  beforeEach(module("ngPull"));
  it("should work", function(){
    expect(true).toBeTruthy();
  });
});
