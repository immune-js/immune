import { Task } from "../../..";

test("it creates a task that succeeds with value", function (done) {
  Task.succeed(2).fork(function () {}, function (x) {
    expect(x).toBe(2);
    done();
  });
});