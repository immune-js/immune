import { Task, flatten } from "../../..";

test("it unwraps a nested task", function (done) {
  return flatten(Task.of(Task.of(2))).fork(function () {}, function (x) {
    expect(x).toBe(2);
    done();
  });
});