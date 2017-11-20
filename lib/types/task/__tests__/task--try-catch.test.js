import { Task } from "../../..";

test("it returns a successful task of the result of the 'try' function if it doesn't throw an exception", function (done) {
  Task.tryCatch(function () {
    return 1 + 1;
  }, function (err) {
    return err.toString();
  }).fork(function (err) {}, function (val) {
    expect(val).toEqual(2);
    done();
  });
});

test("it returns the result of the 'err' function if the 'try' function throws an exception", function (done) {
  Task.tryCatch(function () {
    throw new Error("error");
  }, function (err) {
    return err.toString();
  }).fork(function (err) {
    expect(err).toEqual("Error: error");
    done();
  }, function (succees) {});
});