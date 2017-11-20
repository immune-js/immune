import { Task } from "../../..";

test("it wraps a value in a task", function (done) {
  return Task.of(2).fork(function () {}, function (x) {
    expect(x).toBe(2);
    done();
  });
});