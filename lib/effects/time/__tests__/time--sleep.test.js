import Time from "../";

test("it should invoke a function after x milli seconds", function (done) {
  var startDate = new Date();
  Time.sleep(1000, function () {
    return new Date();
  }).fork(done, function (endDate) {
    expect(startDate.getSeconds() + 1).toBe(endDate.getSeconds());
    done();
  });
});