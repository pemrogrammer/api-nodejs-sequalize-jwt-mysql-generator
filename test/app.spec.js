var expect = require("chai").expect;
var app = require("./index.js");
describe("App", function() {
  describe("Add two numbers", function() {
    it("Adds the two numbers given to it", function() {
      var sum = app.addTwoNumbers(2, 3);
      expect(sum).to.equal(5);
    });
  });
});