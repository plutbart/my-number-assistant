const implementjs = require("implement-js");
const implement = implementjs.default;
const randomNumberStrategy = require("../src/randomNumberStrategy").randomNumberStrategy;
const IRandomStrategy = require("../src/randomStrategy").IRandomStrategy;
const expect = require("expect.js");
const constants = require("../src/constants");

describe("RandomNumberStrategy", () => {
  it("should implement the IRandomStrategy Interface", done => {
    implement(IRandomStrategy)(randomNumberStrategy);
    done();
  });

  it("should be a function", () => {
    expect(randomNumberStrategy.getRandomX).to.be.a("function");
  });

  it("should return number", () => {
    const x = randomNumberStrategy.getRandomX();
    expect(x).to.be.a("number");
  });

  it("should return number in given range", () => {
    const x = randomNumberStrategy.getRandomX();
    expect(x).to.be.within(constants.MIN_NUMBER, constants.MAX_NUMBER);
  });
});
