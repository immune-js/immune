import { Task, map } from "../../..";

test("it applies a transformation function to the value inside the task", function (done) {
  return map(Task.of(2), function (x) {
    return x + 2;
  }).fork(function () {}, function (x) {
    expect(x).toBe(4);
    done();
  });
});

test("it curries the transformation function", function (done) {
  map(Task.of(2), function (x, y) {
    return x + y;
  }).fork(function () {}, function (f) {
    expect(f(4)).toBe(6);
    done();
  });
});