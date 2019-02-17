const implementjs = require("implement-js");
const implement = implementjs.default;
const IServiceBuilder = require("../src/serviceBuilder").IServiceBuilder;
const expect = require("expect.js");
const spy = require("sinon").spy;
const dbMock = {
  ref: spy()
}
const randomNumberServiceBuilder = require("../src/randomNumberServiceBuilder").getBuilder(dbMock)
describe("randomNumberServiceBuilder", () => {
  it("should implement the IServiceBuilder Interface", done => {
    implement(IServiceBuilder)(randomNumberServiceBuilder);
    done();
  });

  it("should be a function", () => {
    expect(randomNumberServiceBuilder.buildService).to.be.a("function");
  });

  it("should return xService", () => {
    const xService = randomNumberServiceBuilder.buildService();
    expect(xService.updateX).to.be.a("function");
    expect(xService.getCurrentXPromise).to.be.a("function");
  });

  it("should be a function", () => {
    expect(randomNumberServiceBuilder.buildService).to.be.a("function");
  });

  it("should set ref", () => {
    expect(dbMock.ref.calledOnce).to.be(true);
  });

});
