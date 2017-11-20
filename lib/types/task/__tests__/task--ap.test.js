import { Task, map, ap } from "../../..";

test("it applies the value inside of one task to a function inside of another", function (done) {
  return ap(map(Task.of(2), function (x) {
    return function (y) {
      return x + y;
    };
  }), Task.of(4)).fork(function () {}, function (x) {
    expect(x).toBe(6);
    done();
  });
});