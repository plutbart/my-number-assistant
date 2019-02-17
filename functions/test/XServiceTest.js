const XService = require("../src/xService").XService;
const expect = require("expect.js");
const spy = require("sinon").spy;

const val = 3;
const randMock = {
  getRandomX: function() {
    return val;
  }
};
const dbRefMock = {
  set: spy(),
  once: function() {
    return new Promise(() => {});
  }
};

const xService = new XService(randMock, dbRefMock);

describe("xService", () => {
  it("should be an object", () => {
    expect(xService).to.be.ok();
  });

  it("should call set", () => {
    xService.updateX();
    expect(dbRefMock.set.calledOnce).to.be(true);
    expect(dbRefMock.set.calledWith(val)).to.be(true);
  });

  it("should call set with given value", () => {
    xService.updateX();
    expect(dbRefMock.set.calledWith(val)).to.be(true);
  });

  it("should return a promise", () => {
    const prom = xService.getCurrentXPromise();
    expect(prom.then).to.be.a("function");
  });
});
